# Theming

All shared styling lives in `theme.js` and is imported directly into components (there's no CSS-in-JS library — components use inline `style={{}}` objects built from these constants).

## Active palette — "The Ledger"

```js
export const C = {
  bg:      "#FBF5EC",  // page background
  paper:   "#FFF8F0",  // card / header background
  ink:     "#1A2A3A",  // primary text, borders, headings
  rule:    "#D8C9B8",  // dividing lines
  rule2:   "#E8DDD0",  // secondary dividing lines
  muted:   "#7A6E65",  // secondary text
  dim:     "#A89E95",  // tertiary / disabled text
  green:   "#1F5C4B",  // positive values, JSE accent
  red:     "#A6402E",  // negative values, SA Economy accent
  blue:    "#1A3F7A",  // NYSE accent
  amber:   "#8C5F00",  // Global news accent
  gold:    "#8C5F00",  // alias of amber
};
```

The palette reads as a financial-newspaper "ledger" aesthetic: warm off-white paper tones, ink-dark text, and muted green/red for gains/losses rather than saturated stoplight colors.

## Legacy palette

`theme.js` also still exports `C_DARK`, a dark "Trading Desk" theme (navy background, gold/blue accents). It's kept for reference but not currently used by any page — every component imports `C`, not `C_DARK`.

## Type

```js
export const SERIF = "'Source Serif 4',Georgia,serif";  // headings, editorial voice
export const MONO   = "'IBM Plex Mono',monospace";        // labels, timestamps, data
export const SANS   = "'Inter',system-ui,sans-serif";     // body copy, nav, buttons
```

`HEAD` is also exported as an alias for `SERIF`, kept for components not yet migrated to the `SERIF` name directly.

## Conventions used across pages

- Positive/gain values use `C.green`; negative/loss values use `C.red` (see the `chgColor` helper pattern in `Crypto.jsx` and `NYSE.jsx`).
- Section accent colors follow the market they represent: green for JSE, blue for NYSE, amber/gold for global, red for SA economy, purple for crypto (used ad hoc, e.g. `News.jsx`'s `CAT_STYLE`).
- Labels, timestamps, and tabular/numeric data use `MONO`; editorial text (headlines, decks, blurbs) uses `SERIF`; UI chrome (nav, buttons, badges) uses `SANS`.
