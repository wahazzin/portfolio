import { defineConfig } from 'vite';

// base: '/portfolio/' = sidan ligger på https://wahazzin.github.io/portfolio/ (GitHub Pages).
// Ska den ligga i roten av en domän (t.ex. Netlify), ändra till '/'.
export default defineConfig({
  base: '/portfolio/',
  build: {
    target: 'es2019',
    assetsInlineLimit: 0,
  },
});
