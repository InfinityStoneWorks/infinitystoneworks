---
name: screenshot-review
description: Serve this site locally and capture/review page screenshots during frontend design work — dev server workflow, screenshot naming conventions, and the visual review checklist (spacing, colors, alignment, shadows, nav links).
---

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
