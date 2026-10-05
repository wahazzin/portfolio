import { defineConfig } from 'vite';

// base: './' gör att dist/ fungerar var som helst (Netlify Drop, undermapp, osv.)
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
    assetsInlineLimit: 0,
  },
});
