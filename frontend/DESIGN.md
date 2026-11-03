# FoodBridge design system

> Adapted from the Beard Meats Food reference supplied via Inspo
> (<https://inspomcp.dev/sites/beardmeatsfood-co-uk>). Adapt, don't copy: the
> reference supplies the type ramp, contrast, sticker language and marquee
> rhythm; FoodBridge supplies its own food-rescue identity.

## Direction

Loud, high-contrast, comic-brutalist food rescue. Black canvas, bone-white type,
acid-neon accents, chunky 2px borders, 10px radii and hard offset shadows. Content
should feel like a market poster pasted onto a dark wall, not a soft SaaS dashboard.

**Macrostructure:** Marquee Hero. A full-bleed headline, rotating sticker cluster,
3D food scene, then a neon ticker. Sections alternate between midnight panels and a
bone-white impact slab.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--fb-app` | `#1A1A1A` | default canvas |
| `--fb-app-deep` | `#111111` | wells, nav, footer |
| `--fb-panel` | `#1C1C1C` | cards |
| `--fb-elevated` | `#262626` | hover / raised surfaces |
| `--fb-text` | `#F8F8F8` | primary type |
| `--fb-text-3` / `--fb-muted` | `#AAAAAA` | secondary type |
| `--fb-line` | `#444444` | borders |
| `--fb-accent` | `#E0FF00` | neon CTA, stickers, marquee |
| `--fb-accent-soft` | `#ECFB7E` | highlight text |
| `--fb-accent-deep` | `#BAD306` | pressed / support |
| `--fb-leaf` | `#BAD306` | food/organic support |
| `--fb-secondary` | `#ECFB7E` | warm contrast |
| `--fb-highlight` | `#E0FF00` | focus and alerts |
| `--fb-danger` | `#FF4630` | urgent / destructive |

Theme variants keep the same structure:

- **Harvest** (default): midnight black + neon acid.
- **Orchard**: bone `#F8F8F8` canvas, ink `#1A1A1A`, olive `#667210` accent.
- **Night Market**: near-black + wheat neon with tomato urgency.

## Typography

- **Display:** Thunder 700–800, uppercase, line-height `0.88`, tight tracking.
  Use for h1/h2, huge stats and marquee copy. Never use Playfair/serif here.
- **Body:** Roboto 400/500, 16px base, 1.5 line-height.
- **UI labels:** uppercase Roboto 700 with `0.16em–0.24em` tracking.
- Keep the reference ratio, not fixed pixel sizes: display is roughly 4–8× body.

## Components

- **Stickers:** rotated pills or rectangles with 2px ink borders and 3–5px hard
  shadows. FoodBridge copy should stay original: `RESCUE APPROVED`,
  `EDIBLE, NOT LANDFILL`, `HOT LINE, ZERO WASTE`, `IDLI. DOSA. VADA. RESCUE.`
  Do not reuse Beard logos, catchphrases or illustrations.
- **Buttons:** 10px radius, 2px border, uppercase bold Roboto, neon fill on black.
  Hover: translate `-3px, -3px` and add a hard bone/neon shadow.
- **Cards:** solid panel, 2px line border, 10px radius. Hover: lift `-4px, -4px`
  with an 8px neon shadow.
- **Marquee:** neon bar, ink text, zap/star separators, infinite horizontal scroll.
- **Impact slab:** bone background, ink type, neon sticker, 1px grid gaps.

## Motion

Scroll reveals are short (0.4–0.6s) and directional. 3D scenes orbit slowly and
respond to pointer hover. Marquee and sticker wobble are ambient, never blocking.
Respect `prefers-reduced-motion`.

## Imagery

Procedural three.js only, no stock photography. FoodBridge's hero bridge, Tamil
kitchen (idli, dosa, medu vada, filter coffee, banana leaf, vegetables) and rescue
crates use the neon/ink palette. Stickers and typography carry the comic energy.

## Guardrails

- 2px borders, hard shadows, 10px radii, no glassmorphism or soft blur cards.
- Neon is an accent, not a page background; keep large fields black or bone.
- Preserve strong contrast and visible focus rings.
- Use original FoodBridge stickers and food illustrations; never copy reference
  artwork, logos or exact copy.
