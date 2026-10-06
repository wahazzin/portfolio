// =====================================================================
// PROJEKT (showpiece)
// Desktop (>=1024 px): sektionen fästs och korten scrollar horisontellt,
//   bilderna "öppnas" med clip-path. Texten under korten animeras aldrig (alltid läsbar).
// Mobil/surfplatta: vertikal lista, bilderna öppnas när de scrollas in.
// Reducerad rörelse: vanlig vertikal lista utan effekter.
// =====================================================================
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
      const inner = media.querySelector('.project__placeholder');
      gsap.fromTo(media,
        { clipPath: 'inset(8% 14% 8% 14% round 14px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 14px)',
          ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left 95%', end: 'left 35%', scrub: true },
        });
      if (inner) gsap.fromTo(inner,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
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
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: media, start: 'top bottom', once: true },
        });
      const ph = media.querySelector('.project__placeholder');
      if (ph) gsap.fromTo(ph,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    });
  });

}
