# HOME31 No-Build GitHub Pages Rescue

This version runs directly on GitHub Pages. It does not require React, Vite, npm, GitHub Actions, or a `dist` build.

## Deploy

1. Delete or move the old React/Vite files from the repository root.
2. Upload these files directly to the root of `retreat_mr`:
   - `index.html`
   - `404.html`
   - `health.html`
   - `.nojekyll`
3. In GitHub, open **Settings → Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**.
6. Save and wait for GitHub Pages to publish.
7. Test: `https://abdzulkifli.github.io/retreat_mr/health.html`
8. Then open: `https://abdzulkifli.github.io/retreat_mr/`

Because this is a single self-contained HTML experience, there are no asset paths or build workflow that can fail.
