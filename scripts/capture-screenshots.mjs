// Tar skärmdumpar av projektsajterna och sparar optimerade WebP i public/images/.
// Körs av .github/workflows/screenshots.yml (eller lokalt: npm i --no-save playwright sharp
// && npx playwright install chromium && node scripts/capture-screenshots.mjs)
import { chromium } from 'playwright';
import sharp from 'sharp';

const SITES = [
  { name: 'kunglig-stadning', url: 'https://kungligstadning.se' },
  { name: 'pizzeria-tavolino', url: 'https://tavolino.yassin-dev.workers.dev' },
];
const VIEWS = [
  { suffix: 'desktop', width: 1440, height: 900, dpr: 1, outWidth: 1440, mobile: false },
  { suffix: 'mobile', width: 390, height: 844, dpr: 2, outWidth: 600, mobile: true },
];

const browser = await chromium.launch();
for (const site of SITES) {
  for (const v of VIEWS) {
    const ctx = await browser.newContext({
      viewport: { width: v.width, height: v.height },
      deviceScaleFactor: v.dpr,
      isMobile: v.mobile,
      hasTouch: v.mobile,
      locale: 'sv-SE',
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    // Stäng eventuella cookie-banners
    for (const label of [/acceptera/i, /godkänn/i, /accept/i, /ok/i]) {
      const btn = page.getByRole('button', { name: label }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        break;
      }
    }
    await page.waitForTimeout(2500);
    const png = await page.screenshot({ type: 'png' });
    const out = `public/images/${site.name}-${v.suffix}.webp`;
    await sharp(png).resize({ width: v.outWidth }).webp({ quality: 78, effort: 6 }).toFile(out);
    console.log('saved', out);
    await ctx.close();
  }
}
await browser.close();
