# CLAUDE.md — Frontend Website Rules

## Project

Marketing site for **Infinity Stone Works** — tagline **"Quality That Never Ends."** A natural stone (granite/marble/quartz) company. Eight static pages: Welcome, Our Curated Collection, Homeowner Information, Care & Warranty, Photos, Reviews, FAQ, Contact Us. See `brand_assets/` for logo and color assets.

## Always Do First

– **Invoke the `frontend-design` skill** before writing any frontend code. No skipping, no exceptions, every single session.

## Output Defaults

– Web pages information:
  - infinitystoneworks.shop
  - you are to only grab information from the website, for use on the new pages. Do NOT use any styling, color, or font styles from this website.

– Eight pages, sharing one external stylesheet at `css/style.css`. Pages use the **pretty URL** technique — every page (except Welcome) lives in its own folder as `index.html`, so it's reachable without a `.html` extension (e.g. `/collection/` instead of `/collection.html`). This works with zero server config on any static host, including GoDaddy, because web servers serve a directory's `index.html` by default:
  - `index.html` — Welcome (`/`)
  - `collection/index.html` — Our Curated Collection (`/collection/`)
  - `homeowner-information/index.html` — Homeowner Information (`/homeowner-information/`)
  - `care-warranty/index.html` — Care & Warranty (`/care-warranty/`)
  - `photos/index.html` — Photos (`/photos/`)
  - `reviews/index.html` — Reviews (`/reviews/`)
  - `faq/index.html` — FAQ (`/faq/`)
  - `contact/index.html` — Contact Us (`/contact/`)

  Homeowner Information also spawns two nested sub-pages (see `SITE-INFO.md`): `homeowner-information/project-guide/index.html` (`/homeowner-information/project-guide/`) and `homeowner-information/project-guide/checklist/index.html` (`/homeowner-information/project-guide/checklist/`).

  Because pages live at varying folder depths, every internal link (nav, footer, logo, in-page links) and every shared-asset reference (`css/style.css`, `js/main.js`, `brand_assets/`, `assets/`) must use a **root-relative path** (leading `/`) — never a page-relative one — so it resolves correctly no matter how deep the page is nested.

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

– Every internal link and shared-asset reference uses a root-relative path (leading `/`), never `.html` or a page-relative path — pretty URLs break otherwise

– `transition: all` is never used

– Blue or indigo cannot be the primary color — stick to the Infinity Stone Works palette

– Real brand assets (logo, colors, fonts) always win over placeholders once available in `brand_assets/`