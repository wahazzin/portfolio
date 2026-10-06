// =====================================================================
// PROJEKT (showpiece)
// Desktop (>=1024 px): sektionen fästs och korten scrollar horisontellt,
//   bilderna "öppnas" med clip-path. Texten under korten animeras aldrig (alltid läsbar).
// Mobil/surfplatta: vertikal lista, bilderna öppnas när de scrollas in.
// Reducerad rörelse: vanlig vertikal lista utan effekter.
// =====================================================================
export function initProjects(gsap, scrollToTarget) {
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

    // ---------- Positionsindikator (1 / 3) + föregående/nästa ----------
    const nav = section.querySelector('.projects__nav');
    const current = nav.querySelector('[data-gallery-current]');
    nav.querySelector('[data-gallery-total]').textContent = projects.length;
    const prevBtn = nav.querySelector('[data-gallery="prev"]');
    const nextBtn = nav.querySelector('[data-gallery="next"]');
    let index = 0;

    // vilket kort ligger närmast skärmens mitt just nu?
    const updateIndex = () => {
      const mid = window.innerWidth / 2;
      let best = 0, bestD = Infinity;
      projects.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best !== index || current.textContent !== String(best + 1)) {
        index = best;
        current.textContent = best + 1;
      }
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === projects.length - 1;
    };
    scroll.eventCallback('onUpdate', updateIndex);
    updateIndex();

    // scrollposition där kort i hamnar i mitten (sista kortet: så långt det går)
    const scrollFor = (i) => {
      const st = scroll.scrollTrigger;
      const x = gsap.getProperty(track, 'x');
      const trackRect = track.getBoundingClientRect();
      const r = projects[i].getBoundingClientRect();
      const inTrack = r.left - trackRect.left; // kortets plats i spåret
      const base = trackRect.left - x; // spårets vänsterkant när x = 0
      const targetX = gsap.utils.clamp(-distance(), 0, window.innerWidth / 2 - base - inTrack - r.width / 2);
      // x går linjärt från 0 till -distance över scrollsträckan start -> end
      return st.start + (-targetX / distance()) * (st.end - st.start);
    };
    const go = (dir) => {
      const i = gsap.utils.clamp(0, projects.length - 1, index + dir);
      scrollToTarget(scrollFor(i));
    };
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);

    return () => {
      section.classList.remove('is-horizontal');
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
    };
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
