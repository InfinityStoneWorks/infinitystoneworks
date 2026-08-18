# CLAUDE.md — Frontend Website Rules

## Project

Marketing site for **Infinity Stone Works** — tagline **"Quality That Never Ends."** A natural stone (granite/marble/quartz) company. Eight static pages: Welcome, Our Curated Collection, Homeowner Information, Care & Warranty, Photos, Reviews, FAQ, Contact Us. See `brand_assets/` for logo and color assets.

## Always Do First

– **Invoke the `frontend-design` skill** before writing any frontend code. No skipping, no exceptions, every single session.

## Local Server

– **Everything gets served on localhost** — taking a screenshot from a `file:///` URL is not acceptable.

– Spin up the dev server using `node serve.mjs` (this serves the project root at `http://localhost:3000`)

– `serve.mjs` is in the project root. Get it running in the background before any screenshot step.

– Check whether the server is already up before starting it again. One instance at a time.

## Screenshot Workflow

– Puppeteer is a project dependency (installed via `npm install`) and manages its own bundled Chromium — no separate paths needed.

– **Screenshots always come from localhost:** `node screenshot.mjs http://localhost:3000/<page>.html`

– Each screenshot is written to `./temporary screenshots/screenshot-N.png`, auto-incremented and never overwritten.

– To attach a label: `node screenshot.mjs http://localhost:3000/<page>.html label` → saves as `screenshot-N-label.png`

– `screenshot.mjs` is in the project root. Do not modify it.

– Once the screenshot is saved, read the PNG from `temporary screenshots/` using the Read tool to view and review it.

– Review each page after building it: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing, and that nav/links to the other 7 pages work.

## Output Defaults

– Eight pages, each its own `.html` file at the project root, sharing one external stylesheet at `css/style.css`:
  - `index.html` — Welcome
  - `collection.html` — Our Curated Collection
  - `homeowner-information.html` — Homeowner Information
  - `care-warranty.html` — Care & Warranty
  - `photos.html` — Photos
  - `reviews.html` — Reviews
  - `faq.html` — FAQ
  - `contact.html` — Contact Us

– Every page shares the same header (site name + tagline), nav linking to all 8 pages, and footer.

– No Tailwind CDN — plain CSS in `css/style.css`, using custom properties (CSS variables) for the brand palette, spacing, and type scale so all 8 pages stay consistent.

– Use `https://placehold.co/WIDTHxHEIGHT` for placeholder images until real photos/assets are provided.

– All layouts are mobile-first

## Brand Assets

– Before starting any design work, look through the `brand_assets/` folder. It could have logos, color guides, style guides, or images.

– If something is in there, use it. Placeholders have no place when real assets exist.

– A logo in the folder gets used. A defined color palette means those exact values get used — no making up brand colors.

## Anti-Generic Guardrails

– **Colors:** Use the Infinity Stone Works palette from `brand_assets/color_guide.png` as CSS custom properties in `css/style.css`:
  - `--gold: #D1B67F` (primary accent)
  - `--charcoal: #484B4D` (primary dark / text)
  - `--sage: #7C8373`
  - `--taupe: #B8A898`
  - `--umber: #695C55`
  - `--bg-light: #F9FAFB`
  No generic blue/indigo anywhere on the site.

– **Shadows:** No flat single-value `box-shadow`. Build depth with layered, color-tinted shadows at low opacity (e.g. stack 2-3 shadows tinted with `--charcoal` or `--umber`).

– **Typography:** Headings and body text get different fonts. The logo uses a serif display face for "Infinity Stone Works" — pair a matching serif/display font for headings with a clean sans-serif for body text. Large headings get tight tracking (`-0.03em`), body text gets generous line-height (`1.7`).

– **Gradients:** Stack multiple radial gradients on top of each other where backgrounds need depth. Bring in grain/texture through an SVG noise filter, not flat fills.

– **Animations:** Stick to `transform` and `opacity` only. Never use `transition: all`. Easing should feel spring-like (e.g. `cubic-bezier(0.34, 1.56, 0.64, 1)`), not linear/ease-default.

– **Interactive states:** `:hover`, `:focus-visible`, and `:active` states are required on every clickable element. No skipping.

– **Images:** Layer a gradient overlay (e.g. `linear-gradient(to top, rgba(72,75,77,0.6), transparent)` using `--charcoal`) on top of photos, and apply `mix-blend-mode: multiply` for a cohesive color treatment.

– **Spacing:** Define a spacing scale as CSS custom properties (e.g. `--space-1` through `--space-8`) and use only those values — no arbitrary one-off pixel values.

– **Depth:** Build with a surface hierarchy in mind (base → elevated → floating), using the shadow and color tokens above. Everything sitting flat at the same level is not good enough.

## Hard Rules

– Every page uses the shared header, nav, and footer — no one-off layouts per page

– `transition: all` is never used

– Blue or indigo cannot be the primary color — stick to the Infinity Stone Works palette

– Real brand assets (logo, colors, fonts) always win over placeholders once available in `brand_assets/`