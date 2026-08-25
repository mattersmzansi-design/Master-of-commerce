import express from "express";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.join(__dirname, "downloads");
const JOBS_FILE = path.join(__dirname, "jobs.json");
const PORT = process.env.PORT || 4173;
const POLL_INTERVAL_MS = 15_000;

if (!existsSync(DOWNLOADS_DIR)) mkdirSync(DOWNLOADS_DIR, { recursive: true });

// --- job persistence -------------------------------------------------

async function loadJobs() {
  try {
    const raw = await readFile(JOBS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveJobs(jobs) {
  await writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

let jobs = await loadJobs();

// --- helpers -----------------------------------------------------------

function safeFilename(name) {
  const base = path.basename(name || "download").replace(/[/\\]/g, "_");
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 150);
  return cleaned || "download";
}

function filenameFromUrl(url) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last || "download";
  } catch {
    return "download";
  }
}

async function uniquePath(dir, filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = filename;
  let n = 1;
  while (existsSync(path.join(dir, candidate))) {
    candidate = `${base} (${n})${ext}`;
    n += 1;
  }
  return path.join(dir, candidate);
}

async function runDownload(job) {
  job.status = "downloading";
  job.startedAt = new Date().toISOString();
  await saveJobs(jobs);

  const tmpPath = path.join(DOWNLOADS_DIR, `.partial-${job.id}`);
  try {
    const res = await fetch(job.url, { redirect: "follow" });
    if (!res.ok || !res.body) {
      throw new Error(`Server responded ${res.status} ${res.statusText}`);
    }

    await pipeline(Readable.fromWeb(res.body), createWriteStream(tmpPath));

    const desiredName = safeFilename(job.filename || filenameFromUrl(job.url));
    const finalPath = await uniquePath(DOWNLOADS_DIR, desiredName);
    await rename(tmpPath, finalPath);

    job.status = "done";
    job.finishedAt = new Date().toISOString();
    job.savedAs = path.basename(finalPath);
  } catch (err) {
    job.status = "failed";
    job.finishedAt = new Date().toISOString();
    job.error = String(err.message || err);
    if (existsSync(tmpPath)) {
      try {
        await unlink(tmpPath);
      } catch {
        /* ignore cleanup failure */
      }
    }
  }
  await saveJobs(jobs);
}

async function checkDueJobs() {
  const now = Date.now();
  const due = jobs.filter(
    (j) => j.status === "pending" && new Date(j.scheduledAt).getTime() <= now
  );
  for (const job of due) {
    await runDownload(job);
  }
}

setInterval(() => {
  checkDueJobs().catch((err) => console.error("scheduler tick failed:", err));
}, POLL_INTERVAL_MS);
checkDueJobs().catch((err) => console.error("initial scheduler tick failed:", err));

// --- http api ------------------------------------------------------------

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/jobs", (_req, res) => {
  res.json([...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post("/api/jobs", async (req, res) => {
  const { url, filename, scheduledAt } = req.body || {};

  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "Provide a valid http(s) link." });
  }
  const when = scheduledAt ? new Date(scheduledAt) : new Date();
  if (Number.isNaN(when.getTime())) {
    return res.status(400).json({ error: "Invalid scheduled time." });
  }

  const job = {
    id: randomUUID(),
    url,
    filename: filename ? safeFilename(filename) : "",
    scheduledAt: when.toISOString(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  jobs.push(job);
  await saveJobs(jobs);

  // Fires immediately on the next tick if the scheduled time has already passed.
  if (when.getTime() <= Date.now()) {
    checkDueJobs().catch((err) => console.error("immediate run failed:", err));
  }

  res.status(201).json(job);
});

app.delete("/api/jobs/:id", async (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Not found" });
  if (job.status !== "pending") {
    return res.status(400).json({ error: "Only pending jobs can be cancelled." });
  }
  jobs = jobs.filter((j) => j.id !== req.params.id);
  await saveJobs(jobs);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Download scheduler running at http://localhost:${PORT}`);
  console.log(`Saving files to ${DOWNLOADS_DIR}`);
});
