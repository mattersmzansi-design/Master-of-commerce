# Night Download Queue

A tiny local tool: paste a direct file link, pick a time, and it downloads in the
background — so you can queue it before bed and let it run on night-time / off-peak
data instead of staying up to babysit it.

**Use it only for links you have the right to download** — your own cloud backups,
podcast/RSS enclosures, open-license or public-domain files, software installers, or
files from a service you're subscribed to. It's a plain HTTP downloader: it does not
log in to anything, bypass paywalls, or strip DRM, so it can't be pointed at a
streaming service and pull copyrighted music or movies off it.

## Run it

```bash
cd tools/download-scheduler
npm install
npm start
```

Then open http://localhost:4173, paste a link, optionally rename the saved file, pick
a date/time, and submit. Downloaded files land in `tools/download-scheduler/downloads/`.

Leave the process running (e.g. in a spare terminal tab, or under `pm2`/`screen` if you
want it to survive closing the terminal) and it'll fire jobs at their scheduled time,
checking every 15 seconds. Jobs and their status persist to `jobs.json` so a restart
doesn't lose the queue — anything already due fires again once the server is back up.

## How it works

- `server.js` — a small Express server: `GET/POST /api/jobs` to list/schedule,
  `DELETE /api/jobs/:id` to cancel a pending one. A background loop checks for due jobs
  and streams them straight to disk with the platform's built-in `fetch`.
- `public/index.html` — the branded UI (Mzansi Money Matters colours/fonts) for
  pasting a link and watching the queue.
- `jobs.json` and `downloads/` are created at runtime and gitignored.
