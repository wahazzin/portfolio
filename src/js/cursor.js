// =====================================================================
// CUSTOM CURSOR + MAGNETISKA KNAPPAR (bara med mus, aldrig på touch)
// data-cursor="Visa" på ett element -> cursorn blir en bubbla med texten.
// data-magnetic -> elementet dras lätt mot pekaren.
// =====================================================================

export function initCursor(gsap) {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  document.documentElement.classList.add('has-cursor');

  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  const label = cursor.querySelector('.cursor__label');

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

  gsap.set([dot, ring], { x: -100, y: -100 });

  window.addEventListener(
    'pointermove',
    (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      cursor.classList.remove('is-hidden');
    },
    { passive: true }
  );
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));

  // Tillstånd via event delegation (fungerar även för element som läggs till senare)
  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const interactive = e.target.closest('a, button');
    if (labelled) {
      label.textContent = labelled.dataset.cursor;
      cursor.classList.add('is-label');
      cursor.classList.remove('is-hover');
    } else {
      cursor.classList.remove('is-label');
      cursor.classList.toggle('is-hover', !!interactive);
    }
  });
}

export function initMagnetic(gsap) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const text = el.querySelector('.btn__text');
    const txTo = text && gsap.quickTo(text, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const tyTo = text && gsap.quickTo(text, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      if (text) {
        txTo(dx * strength * 0.4);
        tyTo(dy * strength * 0.4);
      }
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
      if (text) {
        txTo(0);
        tyTo(0);
      }
    });
  });
}
