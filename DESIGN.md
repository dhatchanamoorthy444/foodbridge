# Beard Meats Food Design System

*Extracted by Inspo (open source, MIT, powered by Together AI). Reference material for intentional design decisions: adapt, don't copy.*

- **Source:** https://www.beardmeatsfood.co.uk
- **Captured:** 2026-09-10
- **Mode:** dark
- **Macrostructure:** Marquee Hero
- **Stack:** Webflow

---

## Tone

High-contrast black and white palette with heavy, distorted display typography. Comic-style illustrations and jagged yellow accents create a loud, energetic brand presence. · brutalist creator site, high contrast typography, comic style web design, bold display type hero, dark mode food brand

---

## Colors

| Hex | Role (heuristic) |
|---|---|
| `#bad306` | support |
| `#ecfb7e` | ink |
| `#667210` | accent |
| `#747474` | support |
| `#c4c4c4` | support |

Color words: *monochrome*, *high-contrast*

---

## Typography

Detected typefaces: **Thunder**, **Roboto**

| Role | Family | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| h2 | Thunder | 80px | 700 | 0.9 | 0 |
| body | Roboto | 16px | 400 | 1.5 | 0 |
| button | Roboto | 16px | 400 | 1.5 | 0 |

---

## Spacing scale

`16px` · `20px` · `112px`

Base step looks like **4px**.

---

## Border radius

`0px` · `10px` · `50px`

---

## Container

Max content width: **1440px**

---

## CSS variables exposed by the source

```css
:root {
  --text-color--text-primary: #f8f8f8;
  --background-color--background-alternate: #f8f8f8;
  --border-color--border-primary: #f8f8f8;
  --border-color--border-alternate: #1a1a1a;
  --text-color--text-success: #027a48;
  --background-color--background-secondary: #eee;
  --text-color--text-secondary: #f8f8f8;
  --text-color--text-error: #b42318;
  --text-color--text-alternate: #1a1a1a;
  --background-color--background-success: #ecfdf3;
  --background-color--background-error: #fef3f2;
  --border-color--border-secondary: #aaa;
  --background-color--background-primary: #1a1a1a;
  --background-color--background-tertiary: #aaa;
  --base-color-neutral--neutral-light: #aaa;
  --base-color-system--error-red-light: #fef3f2;
  --base-color-neutral--black: #1a1a1a;
  --base-color-neutral--neutral-lighter: #ccc;
  --base-color-neutral--neutral-dark: #444;
  --base-color-brand--white: #f8f8f8;
  --base-color-brand--black: #1a1a1a;
  --base-color-system--error-red: #b42318;
  --link-color--link-primary: #f8f8f8;
  --base-color-system--success-green-light: #ecfdf3;
  --base-color-neutral--white: #f8f8f8;
  --base-color-neutral--neutral: #666;
  --link-color--link-alternate: #1a1a1a;
  --base-color-neutral--neutral-lightest: #eee;
  --base-color-neutral--neutral-darkest: #111;
  --base-color-brand--neon: #e0ff00;
  --base-color-system--success-green: #027a48;
}
```

---

## Components present

- hero fullbleed
- hero with cta
- sticky nav

---

## Notes for the agent

- **Adapt, don't copy.** The type ramp is a *starting point*. Scale it to your project's base size; preserve the *ratio*, not the literal pixels.
- **Color roles are heuristic** (luminance + dominance). Verify against the source URL before committing tokens.
- **Spacing** assumes a constant base step; round detected values to your project's scale (4 / 8 / 16) when implementing.
- **CSS variables** dumped above (when present) are the source's *actual* tokens - those are higher signal than guesses.
- This page's macrostructure is **Marquee Hero**.