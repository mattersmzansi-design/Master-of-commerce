# How to prompt Claude on this project — a cheat sheet

A short, practical guide built from how our sessions have actually gone. Copy any of these prompts and edit the details in **bold**.

---

## 1. Design iteration (mockups before code)

I'll build up to 3 side-by-side mockups if you ask for options. Keep saying "give me three" until you're happy — I won't touch the real site until you say so.

- *"I want to redesign the **header**. Show me **three** mockups — don't touch the code yet."*
- *"Same again but **remove the search box** and **make the wordmark bigger**."*
- *"Do the same but for **desktop**, at a laptop width."*
- *"That's it — use **B**, build it into the site."* ← this is the go-live trigger

**Tips that got great results:**
- Send a screenshot and say *"like this style but change the colour to X"*.
- Reference by number: *"like #2 but with the burger from #1"*.
- Speak in feelings, not code: *"tighter", "hug the corner", "same baseline"*.

---

## 2. Wiring a mockup into the real site

Once we've picked a mockup, this is the go-ahead:

- *"Use **P5-C**. Build it into the site and deploy."*
- *"Build **B2** but keep the mobile version we shipped."*
- *"Wire it up but **don't deploy yet** — I want to see it running first."*

---

## 3. Deploying to production

The `main` branch is what Vercel serves. I'll never merge to main without you asking. Trigger phrases:

- *"Deploy."*  ·  *"Push it live."*  ·  *"Merge to main."*
- *"Deploy but only after **X** works."*

To hold: *"Don't deploy yet, just push to the branch."*

---

## 4. Content / copy changes

- *"Change the tagline from **NEWS · DATA · SPORTS** to **X**."*
- *"Update the top story to be about **X**."*
- *"Rewrite the newsletter blurb — make it shorter and punchier."*

---

## 5. Adding a data source (going from seed data to live)

The pattern that works: name the *thing*, hint at the *source*, tell me what to fall back to.

- *"Make the **JSE page** live. Use **EOD Historical Data** if it's cheap enough, otherwise recommend a source. Fall back to sample data if the API key is missing."*
- *"Replace the news seed with **Marketaux** live headlines. Cache for 10 minutes so we don't burn the quota."*
- *"Wire the calendar to a **live feed** — recommend a good one first."*

If you don't know which source to use, just ask: *"What's the best free source for X?"* — I'll compare 2–3 and recommend one.

---

## 6. Adding a new page or section

- *"Add a new page called **Bonds** at `/bonds`. Coming-soon placeholder for now, styled like the others."*
- *"Add a **Top Movers** section to the NYSE page — show the 5 biggest gainers and losers."*
- *"Add a **crypto watchlist** to the Crypto page. Users can pin coins, saved in local storage."*

---

## 7. Fixing something that broke

- *"The **desktop wordmark** is truncated. Fix and redeploy."*
- *"The **Subscribe button** isn't working on my iPhone — check it."*
- *"The build is failing — what broke, and fix it."*

Send a **screenshot** whenever something looks wrong. It saves me 5 minutes of guessing.

---

## 8. When to ask me to explain

I'll explain briefly as we build (your preference). To go deeper or shallower:

- *"Go deeper on **FormSubmit** — how does it work, what are the risks?"*
- *"What am I paying for at scale here?"*
- *"Just do it — skip the explanation."*
- *"Sanity check — anything I'm missing before we ship?"*

---

## 9. Getting a briefer or status update

- *"Give me a **branded PDF** with what's working and what's not."*  ← this document's sibling
- *"What's on the roadmap? Rank them by impact."*
- *"What would you ship this week if it were up to you?"*

---

## 10. Style + speed guardrails you can set once

Say any of these at the start of a session and I'll follow them all day:

- *"Keep answers **short** — no essays."*
- *"Only do **what I ask** — don't refactor extras."*
- *"Ask **before** doing anything destructive."*
- *"Show me the change before you commit."*

---

## Things that don't work well

- **Vague asks with no examples.** *"Make it better."* → I'll ask what "better" means. Send a screenshot, name a site you like, or point to the specific bit.
- **Multiple unrelated tasks in one message.** Split them — easier to track and undo.
- **Assuming I remember old sessions.** Each conversation starts fresh. If we discussed something last week, paste the key bit back in.
- **Skipping the mockup step for bigger design changes.** Jumping straight to code usually means we redo it. Mockups first, then wire it in.

---

## The magic words

- **"Give me three"** → mockups instead of code.
- **"Deploy"** → merge to `main` and push.
- **"Don't deploy yet"** → keep it on the feature branch.
- **"Go deeper"** / **"Just do it"** → adjust explanation depth.
- **"Show me"** → screenshot, mockup, or dry-run before I commit.

---

*Mzansi Money Matters · Codename: Genesis 🧬 · prepared for mattersmzansi@gmail.com*
