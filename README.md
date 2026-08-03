# HOME31 Journey — `retreat_mr` GitHub Pages Build

This package is configured specifically for:

`https://abdzulkifli.github.io/retreat_mr/`

## Upload

Upload the **contents of this folder** to the root of the `retreat_mr` repository. At the repository's first level you must see:

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

First open:

`https://abdzulkifli.github.io/retreat_mr/health.html`

- If this says **DEPLOYMENT OK**, GitHub Pages and the build output work.
- If `health.html` is 404, the workflow did not deploy or Pages is using the wrong source.
- If `health.html` works but the main page fails, the main page will now display a visible runtime error instead of a blank screen.

## Local run

```bash
npm install --legacy-peer-deps
npm run dev
```
