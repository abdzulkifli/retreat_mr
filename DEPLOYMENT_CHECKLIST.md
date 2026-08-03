# retreat_mr Deployment Checklist

- [ ] Extract the ZIP locally.
- [ ] Upload the extracted contents directly to the repository root.
- [ ] Confirm `.github`, `src`, `public`, `package.json`, `index.html`, and `vite.config.ts` are visible at root.
- [ ] Confirm `vite.config.ts` contains `base: '/retreat_mr/'`.
- [ ] In **Settings → Pages**, select **GitHub Actions**.
- [ ] In **Actions**, run **Deploy HOME31 Journey**.
- [ ] Confirm the build and deployment jobs both show green ticks.
- [ ] Test `/retreat_mr/health.html`.
- [ ] Open `/retreat_mr/` and verify the cinematic loading page reaches 100%.
- [ ] Test both **Enter with sound** and **Enter quietly**.
- [ ] Test graphics quality and reduced-motion controls on mobile.


## Critical check for an endless landing loader

Open the live page and wait ten seconds.

- If it changes to **The application did not start**, GitHub Pages is serving raw repository source instead of the compiled Vite artifact.
- Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.
- Open **Actions → Deploy HOME31 Journey → Run workflow**.
- The workflow must show a green tick for **Verify compiled Pages output** and **Deploy Pages**.
- Hard-refresh the live page after deployment: `Ctrl+Shift+R` on Windows or `Cmd+Shift+R` on macOS.
