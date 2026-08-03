# HOME31 Phase 4 deployment checklist

1. Extract the ZIP locally.
2. Open the extracted folder.
3. Upload all files and folders inside it to the root of `retreat_mr`.
4. Confirm `.github/workflows/deploy-pages.yml` exists in GitHub.
5. Confirm `package.json` and `vite.config.ts` are at repository root.
6. Open Settings → Pages and select GitHub Actions.
7. Open Actions → Deploy HOME31 Journey.
8. Run the workflow from `main`.
9. Confirm the build and deploy jobs both show green.
10. Test `https://abdzulkifli.github.io/retreat_mr/health.html`.
11. Open `https://abdzulkifli.github.io/retreat_mr/` and click Begin the journey.

The Vite base path is fixed to `/retreat_mr/`.
