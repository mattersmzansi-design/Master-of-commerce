# Project Structure

## Current layout on disk

```
Master-of-commerce/
├── index.html
├── main.jsx
├── App.jsx
├── theme.js
├── index.css
├── Nav.jsx
├── Footer.jsx
├── Home.jsx
├── Crypto.jsx
├── News.jsx
├── Betting.jsx
├── Calendar.jsx
├── NYSE.jsx
├── ComingSoon.jsx
├── favicon.svg
├── icons.svg
├── vite.config.js
├── vercel.json
├── eslint.config.js
└── package.json
```

Every source file sits flat at the repo root.

## The layout the code actually expects

The components import each other as if the project were organized like this:

```
src/
├── main.jsx
├── App.jsx
├── theme.js
├── index.css
├── components/
│   ├── Nav.jsx
│   └── Footer.jsx
└── pages/
    ├── Home.jsx
    ├── Crypto.jsx
    ├── News.jsx
    ├── Betting.jsx
    ├── Calendar.jsx
    ├── NYSE.jsx
    └── ComingSoon.jsx
```

For example, `App.jsx` imports `./pages/Home`, and each page imports `../theme` and `../components/Nav`. `index.html` also points at `/src/main.jsx`.

This is the layout described in the repo README's **Project layout** section — it's the target structure, not what's currently checked in. See [Known Issues](Known-Issues.md) for what breaks as a result and how to reconcile it.

## Key files

| File | Role |
|---|---|
| `index.html` | Vite entry HTML; mounts the app at `#root` |
| `main.jsx` | React root, wraps `<App />` in `<StrictMode>` |
| `App.jsx` | All routes, via `react-router-dom`'s `BrowserRouter` |
| `theme.js` | Shared color palette (`C`) and font stacks (`SERIF`, `MONO`, `SANS`) — see [Theming](Theming.md) |
| `Nav.jsx` | Masthead + section navigation, used on every page |
| `Footer.jsx` | Site footer with link columns, used on every page |
| `ComingSoon.jsx` | Generic placeholder screen for unbuilt routes (JSE, 404) |
| `vercel.json` | SPA rewrite rule so client-side routes resolve on refresh |
| `vite.config.js` | Vite + `@vitejs/plugin-react` config |
