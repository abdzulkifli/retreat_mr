import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrganisationSite = repositoryName.endsWith('.github.io');
const githubPagesBase = isUserOrOrganisationSite || !repositoryName
  ? '/'
  : `/${repositoryName}/`;

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? githubPagesBase : '/',
  build: {
    sourcemap: true,
    target: 'es2020'
  }
});
