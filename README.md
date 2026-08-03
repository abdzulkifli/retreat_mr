# HOME31 — The Journey of an Idea

GitHub Pages-ready React + TypeScript + React Three Fiber prototype.

## Important repository layout

Upload the **contents of this folder directly to the repository root**.

Correct:

```text
YOUR-REPOSITORY/
├── .github/workflows/deploy-pages.yml
├── src/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

Incorrect:

```text
YOUR-REPOSITORY/
└── home31-journey/
    ├── .github/
    ├── src/
    └── package.json
```

GitHub only detects the workflow when `.github/workflows` is at the repository root.

## Deploy to GitHub Pages

1. Create a repository and use `main` as the default branch.
2. Extract the ZIP locally.
3. Upload all extracted files and folders directly into the repository root.
4. Commit the files.
5. Go to **Settings → Pages**.
6. Under **Build and deployment**, set **Source** to **GitHub Actions**.
7. Open **Actions** and run **Deploy HOME31 Journey to GitHub Pages**, or push a new commit.
8. Wait for the workflow to complete with a green check.
9. Open **Settings → Pages → Visit site**.

The Vite base path is calculated automatically from the repository name, so both of these forms are supported:

- `https://USERNAME.github.io/`
- `https://USERNAME.github.io/REPOSITORY/`

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
```

Production test:

```bash
npm run build
npm run preview
```

## Corrections in this release

- Removed npm caching from GitHub Actions because the previous package did not include a lockfile.
- Uses direct repository-root structure.
- Calculates the GitHub Pages Vite `base` automatically.
- Removed remote HDR environment loading.
- Removed remote 3D font loading and replaced it with self-contained HTML labels.
- Fixed scene visibility so only the current and neighbouring scenes render.
- Added a WebGL fallback.
- Removed stale generated Vite config files and TypeScript build artifacts.
- Pins dependency versions for repeatable installation.

## If the deployment fails

Open **Actions → failed run → deploy → failed step** and read the first red error.

Common causes:

### No workflow appears

The `.github` folder is not at the repository root, or Actions are disabled for the repository.

### `package.json` not found

The project was uploaded inside an extra folder. Move the project files to the repository root.

### Pages deployment is rejected

Go to **Settings → Pages** and choose **GitHub Actions** as the source.

### Site opens but shows 404 assets

Trigger a new workflow run after committing the corrected `vite.config.ts`.

### Blank 3D area

Try the **Low** quality setting. The page now also shows a fallback message when WebGL is unavailable.

## CPS accountability principle

CPS helps the idea find its place. The accountable business owner must bring it to life.
