// =====================================================================
// KINETISK TYPOGRAFI (signatureffekten)
// Varje bokstav har en egen vikt (variabelt typsnitt 200–800).
// - Desktop: bokstäverna nära muspekaren blir feta och lyfter lite.
// - Alla enheter: vikten kan styras av scroll / intro via group.boost.
// =====================================================================
import { finePointer, reduceMotion, clamp } from './env.js';

const MAX = 800;

export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  const chars = [];
  for (const c of text) {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c;
    frag.appendChild(s);
    chars.push(s);
  }
  el.appendChild(frag);
  return chars;
}

export function initKinetic(gsap) {
  const groups = [...document.querySelectorAll('[data-kinetic]')].map((el) => {
    const min = Number(el.dataset.kineticMin || 400);
    const chars = splitChars(el).map((node) => ({ node, w: min, lift: 0 }));
    // boost: 0..1 extra vikt för hela gruppen (styrs av intro/scroll)
    return { el, min, chars, boost: 0, visible: false };
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const g = groups.find((g) => g.el === e.target);
      if (g) g.visible = e.isIntersecting;
    });
  });
  groups.forEach((g) => io.observe(g.el));

  const pointer = { x: -9999, y: -9999, active: false };
  const useCursor = finePointer && !reduceMotion;
  if (useCursor) {
    window.addEventListener(
      'pointermove',
      (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      },
      { passive: true }
    );
    document.documentElement.addEventListener('pointerleave', () => (pointer.active = false));
  }

  const update = () => {
    for (const g of groups) {
      if (!g.visible) continue;
      const range = MAX - g.min;
      const radius = g.radius || (g.radius = Math.max(180, parseFloat(getComputedStyle(g.el).fontSize) * 1.6));

      // 1) läs alla positioner först (en layout per frame)
      const prox = g.chars.map(({ node }) => {
        if (!useCursor || !pointer.active) return 0;
        const r = node.getBoundingClientRect();
        const dx = pointer.x - (r.left + r.width / 2);
        const dy = pointer.y - (r.top + r.height / 2);
        const f = clamp(1 - Math.hypot(dx, dy) / radius, 0, 1);
        return f * f * (3 - 2 * f);
      });

      // 2) skriv sedan
      g.chars.forEach((c, i) => {
        const target = g.min + range * clamp(g.boost + prox[i], 0, 1);
        c.w += (target - c.w) * 0.14;
        const lift = prox[i] * -0.06;
        c.lift += (lift - c.lift) * 0.14;
        if (Math.abs(c.w - (c._w || 0)) > 0.5) {
          c.node.style.fontWeight = Math.round(c.w);
          c._w = c.w;
        }
        if (Math.abs(c.lift - (c._l || 0)) > 0.0005) {
          c.node.style.translate = `0 ${c.lift.toFixed(3)}em`;
          c._l = c.lift;
        }
      });
    }
  };

  if (!reduceMotion) gsap.ticker.add(update);
  window.addEventListener('resize', () => groups.forEach((g) => (g.radius = 0)));

  // set vikten direkt (för reducerad rörelse / statiska lägen)
  groups.forEach((g) => g.chars.forEach((c) => (c.node.style.fontWeight = g.min)));
  return groups;
}
