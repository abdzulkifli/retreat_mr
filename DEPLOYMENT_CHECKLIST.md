# Exact recovery steps

1. In the `retreat_mr` repository, delete the old project files.
2. Extract this ZIP locally.
3. Upload everything inside the extracted folder to the repository root.
4. Confirm `.github/workflows/deploy-pages.yml` exists in GitHub.
5. Go to Settings → Pages.
6. Set Source to GitHub Actions.
7. Go to Actions → Deploy HOME31 Journey.
8. Run workflow from the `main` branch.
9. Wait for both build and deploy steps to show green.
10. Test `/retreat_mr/health.html` before testing the main URL.

The Vite base path is hardcoded as `/retreat_mr/` to match this repository exactly.
