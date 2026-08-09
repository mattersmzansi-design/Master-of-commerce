# docs/ — owner-facing project docs

Two documents live here. Both keep the same brand look (orange gradient badge,
cyan accent, Poppins + Lora).

## The briefer — updated every session

- **Read:** `mzansi-briefer.pdf` (this is what you open on the phone)
- **Edit:** `briefer.md` (source of truth — plain markdown, easy to edit)
- **Rebuild:** `node docs/render-pdfs.mjs`

At the end of every working session, the briefer's markdown should be updated to
reflect what shipped. The PDF is regenerated from it.

## The prompting cheat sheet — stable, rarely edited

- `mzansi-prompt-guide.pdf` — the branded PDF
- `prompts.md` — the plain-text version for copy-pasting prompts

This changes only when we materially change *how* we work together.

## What's in this folder

```
docs/
├── briefer.md              # source for the session briefer
├── mzansi-briefer.pdf      # rendered from briefer.md
├── prompts.md              # human-readable prompting guide
├── mzansi-prompt-guide.pdf # branded PDF of the guide
├── render-pdfs.mjs         # regenerates the briefer PDF
├── fonts/                  # Poppins + Lora woff2 (self-contained)
└── README.md               # you are here
```
