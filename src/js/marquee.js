// =====================================================================
// MARQUEE (tjänster): två rader som glider åt motsatt håll.
// Scrollhastigheten ger extra fart, och scrollriktningen vänder dem.
// Pausas när den inte syns. Står still vid reducerad rörelse.
// =====================================================================

export function initMarquee(gsap, ScrollTrigger) {
  const rows = [...document.querySelectorAll('[data-marquee]')];
  if (!rows.length) return;

  const tracks = rows.filter((row) => row.offsetWidth > 0).map((row) => {
    // (dolda rader, t.ex. andra raden på mobil, hoppas över)
    const inner = row.querySelector('.marquee__inner');
    // klona tills raden är minst dubbelt så bred som skärmen
    const clones = Math.min(12, Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(1, inner.offsetWidth)) + 1));
    for (let i = 1; i < clones; i++) row.appendChild(inner.cloneNode(true));
    const items = row.querySelectorAll('.marquee__inner');
    return { row, items, dir: Number(row.dataset.marquee), x: 0, w: inner.offsetWidth };
  });

  let active = false;
  let boost = 0;
  let direction = 1;

  ScrollTrigger.create({
    trigger: rows[0].parentElement,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (active = self.isActive),
    onUpdate: (self) => {
      direction = self.direction;
      boost = Math.min(Math.abs(self.getVelocity()) / 400, 8);
    },
  });

  window.addEventListener('resize', () => tracks.forEach((t) => (t.w = t.items[0].offsetWidth || t.w)));

  gsap.ticker.add((time, delta) => {
    if (!active) return;
    boost *= 0.92;
    const speed = (0.06 + boost * 0.12) * delta; // px per ms
    tracks.forEach((t) => {
      t.x -= speed * t.dir * direction;
      if (t.w) t.x = gsap.utils.wrap(-t.w, 0, t.x);
      gsap.set(t.items, { x: t.x, force3D: true });
    });
  });
}
