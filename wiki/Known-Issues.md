# Known Issues

## File layout doesn't match import paths

**Symptom**: `npm run dev` / `npm run build` fail to resolve modules.

All source files (`App.jsx`, `theme.js`, `Nav.jsx`, `Home.jsx`, etc.) currently sit flat at the repo root. But:

- `index.html` loads `/src/main.jsx`, not `/main.jsx`.
- `App.jsx` imports pages from `./pages/Home`, `./pages/Crypto`, etc.
- Every page component imports `../theme`, `../components/Nav`, and `../components/Footer`.

None of those paths exist given the current flat layout — there's no `src/`, `src/pages/`, or `src/components/` directory. See [Project Structure](Project-Structure.md) for the layout the imports expect versus what's checked in.

**Fix**: move files into the structure the imports already assume:

```
main.jsx        → src/main.jsx
App.jsx         → src/App.jsx
theme.js        → src/theme.js
index.css       → src/index.css
Nav.jsx         → src/components/Nav.jsx
Footer.jsx      → src/components/Footer.jsx
Home.jsx        → src/pages/Home.jsx
Crypto.jsx      → src/pages/Crypto.jsx
News.jsx        → src/pages/News.jsx
Betting.jsx     → src/pages/Betting.jsx
Calendar.jsx    → src/pages/Calendar.jsx
NYSE.jsx        → src/pages/NYSE.jsx
ComingSoon.jsx  → src/pages/ComingSoon.jsx
```

`favicon.svg` and `icons.svg` can stay at the root (or move to `public/`) since `index.html` references `favicon.svg` directly and Vite serves root-level static assets as-is.

## Stray `Public` file

There's a 1-byte file named `Public` (capital P, no extension) at the repo root — not a `public/` directory. It looks like an accidental artifact rather than intentional Vite `public/` folder (which is lowercase and holds static assets copied as-is to the build output). Worth confirming whether this should be deleted or was meant to become the actual `public/` directory.

## No `.env.example` in the repo

The README's setup instructions say to "rename `.env.example` to `.env`," but no `.env.example` file exists in the repo. See [Environment Variables](Environment-Variables.md) for the one key (`VITE_AV_KEY`) it should contain.

## Mock data throughout

News, Economic Calendar, and Soccer Betting are all hardcoded mock arrays with no live API wired up yet. This isn't a bug — the README and code comments describe it as the current state — but it's worth flagging for anyone expecting live data out of the box. See [Roadmap](Roadmap.md).
