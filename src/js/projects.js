// =====================================================================
// PROJEKT (showpiece)
// Desktop (>=1024 px): sektionen fästs och korten scrollar horisontellt,
//   bilderna "öppnas" med clip-path och har parallax inuti ramen.
// Mobil/surfplatta: vertikal lista, bilderna öppnas när de scrollas in.
// Reducerad rörelse: vanlig vertikal lista utan effekter.
// =====================================================================
import { finePointer } from './env.js';

export function initProjects(gsap) {
  const section = document.querySelector('.projects');
  if (!section) return;
  const track = section.querySelector('.projects__track');
  const projects = [...section.querySelectorAll('[data-project]')];
  const mm = gsap.matchMedia();

  // ---------- Desktop: horisontell scroll ----------
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-horizontal');
    const distance = () => track.scrollWidth - window.innerWidth;

    const scroll = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => '+=' + distance(),
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    projects.forEach((p) => {
      const media = p.querySelector('.project__media');
      const inner = media.children;
      gsap.fromTo(media,
        { clipPath: 'inset(8% 14% 8% 14% round 14px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 14px)',
          ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left 95%', end: 'left 35%', scrub: true },
        });
      gsap.fromTo(inner,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
        });
      gsap.from(p.querySelector('.project__info').children, {
        y: 30,
        opacity: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left 70%', once: true },
      });
    });

    return () => section.classList.remove('is-horizontal');
  });

  // ---------- Mobil/surfplatta: vertikal ----------
  mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
    projects.forEach((p) => {
      const media = p.querySelector('.project__media');
      gsap.fromTo(media,
        { clipPath: 'inset(18% 8% 0% 8% round 14px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 14px)',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: media, start: 'top 85%', once: true },
        });
      gsap.fromTo(media.children,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    });
  });

  // ---------- Hover: bilden följer pekaren lite inuti ramen ----------
  if (finePointer) {
    section.querySelectorAll('.project__media').forEach((media) => {
      media.addEventListener('pointermove', (e) => {
        const r = media.getBoundingClientRect();
        media.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        media.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      media.addEventListener('pointerleave', () => {
        media.style.setProperty('--mx', 0);
        media.style.setProperty('--my', 0);
      });
    });
  }
}
