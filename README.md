# HOME31 — The Journey of an Idea

Phase 4.1 adds a cinematic loading and entry sequence to the interactive React/Three.js journey.

## Loading experience

The loading screen now follows real application lifecycle milestones:

1. browser and capability check;
2. WebGL renderer creation;
3. continuous-world scene graph mounting;
4. Retreat Room lighting;
5. character animation warm-up;
6. shader compilation and first-frame verification;
7. journey ready.

It also includes:

- an animated HOME31 assembly symbol;
- an expressive Idea 31 loading character;
- auto-detected graphics quality with manual override;
- cinematic/reduced-motion selection;
- explicit sound consent;
- a smooth transition directly into Chapter 1;
- WebGL fallback readiness handling.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

This repository is configured for:

```text
https://abdzulkifli.github.io/retreat_mr/
```

1. Upload all files to the root of the `retreat_mr` repository.
2. Open **Settings → Pages**.
3. Set the source to **GitHub Actions**.
4. Push to `main` or manually run the deployment workflow.
5. Confirm `https://abdzulkifli.github.io/retreat_mr/health.html` before opening the main experience.

## Important

Do not upload the outer extracted folder. The repository root must directly contain `.github`, `src`, `public`, `package.json`, `index.html`, and `vite.config.ts`.


## Loader fail-safe

This version cannot remain on the landing loader indefinitely:

- if the WebGL scene starts, the normal cinematic entry becomes available;
- if WebGL does not confirm readiness within seven seconds, performance mode becomes available;
- if the React bundle itself never starts, the static landing page displays a deployment diagnosis after ten seconds;
- the GitHub workflow verifies that `dist/index.html` references `/retreat_mr/assets/` and does not reference raw `/src/main.tsx`.

If the static diagnosis appears, GitHub Pages is serving repository source rather than the compiled Actions artifact. Set **Settings → Pages → Source** to **GitHub Actions**.
