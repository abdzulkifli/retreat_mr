# HOME31 — The Journey of an Idea
## Phase 4: Interactive World Build

This repository is configured specifically for:

`https://abdzulkifli.github.io/retreat_mr/`

## What changed in Phase 4

- The 3D world itself is now interactive.
- Each chapter highlights one meaningful object at a time.
- Hovering and tapping produces immediate visual feedback.
- Seven environments transform as progress is completed.
- Idea 31 has stronger expressions, an animated aura, reaction symbols and a propulsion effect.
- Scroll and arrow-key navigation are available after completing a chapter.
- Mobile keeps the 3D stage and narrative panel in separate protected zones.
- Sound is optional and generated locally through the Web Audio API.
- No external models, fonts, HDR files or runtime CDN assets are required.

## Upload correctly

Extract the ZIP and upload the **contents** directly to the root of the `retreat_mr` repository.
At the repository's first level you must see:

- `.github/`
- `public/`
- `src/`
- `index.html`
- `package.json`
- `vite.config.ts`

Do not upload a parent folder containing these files.

## GitHub Pages setting

Open **Settings → Pages** and set **Source** to **GitHub Actions**.

Then open **Actions → Deploy HOME31 Journey → Run workflow**.

## Verify deployment

Open:

`https://abdzulkifli.github.io/retreat_mr/health.html`

It should display **DEPLOYMENT OK**.

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Production validation

```bash
npm run check
npm run build
npm run preview
```
