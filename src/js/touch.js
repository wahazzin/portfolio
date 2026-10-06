// =====================================================================
// MOBIL-EFFEKTER (telefoner kan inte hovra – de får egna ögonblick)
// 1. Hero-namnet sträcks/lutas lite efter scrollhastigheten och lägger sig sedan.
// 2. Projektkorten växer/lutar lätt när de passerar mitten av skärmen.
// 3. Tryck-läge på knappar, tjänster och kort (scale + glöd) – ligger i CSS (:active).
// Bara transform/opacity (GPU), aldrig något som döljer text. Av vid reducerad rörelse.
// =====================================================================
export function initTouchEffects(gsap, ScrollTrigger) {
  // iOS aktiverar :active bara om det finns en touch-lyssnare
  document.addEventListener('touchstart', () => {}, { passive: true });

  // 1) Hero-namnet reagerar på scrollfart
  const title = document.querySelector('.hero__title');
  if (title) {
    const skew = gsap.quickTo(title, 'skewY', { duration: 0.5, ease: 'power3' });
    const stretch = gsap.quickTo(title, 'scaleY', { duration: 0.5, ease: 'power3' });
    gsap.set(title, { transformOrigin: 'left center' });
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-2500, 2500, self.getVelocity());
        skew(v / -500); // max ±5°
        stretch(1 + Math.abs(v) / 25000); // max +10 %
      },
      onLeave: () => { skew(0); stretch(1); },
      onLeaveBack: () => { skew(0); stretch(1); },
    });
    // lägg sig när scrollen stannar
    ScrollTrigger.addEventListener('scrollEnd', () => { skew(0); stretch(1); });
  }

  // 2) Projektkort: störst och rakt i mitten av skärmen
  document.querySelectorAll('.project__media').forEach((media) => {
    gsap.timeline({
      scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
    })
      .fromTo(media, { scale: 0.92, rotate: -1.5 }, { scale: 1, rotate: 0, ease: 'power1.out' })
      .to(media, { scale: 0.95, rotate: 1, ease: 'power1.in' });
  });
}
