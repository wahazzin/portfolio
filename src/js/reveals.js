// =====================================================================
// TEXT-AVSLÖJANDEN
// [data-reveal-lines]  -> rad för rad bakom masker när de scrollas in
// [data-scrub-words]   -> orden tänds ett i taget, kopplat till scroll
// [data-service]       -> tjänsteraderna glider in
// =====================================================================
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduceMotion } from './env.js';

const show = (el) => (el.style.visibility = 'visible');

export function initLineReveals(gsap, SplitText, { heroGate }) {
  document.querySelectorAll('[data-reveal-lines]').forEach((el) => {
    if (reduceMotion) return show(el);
    const inHero = !!el.closest('.hero');

    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit(self) {
        show(el);
        const tween = gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          paused: inHero,
          scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
        if (inHero) heroGate.then(() => tween.delay(0.35).play());
        return tween;
      },
    });
  });
}

export function initScrubWords(gsap, SplitText) {
  document.querySelectorAll('[data-scrub-words]').forEach((el) => {
    show(el);
    if (reduceMotion) return;
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word' });
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      }
    );
  });
}

export function initServices(gsap) {
  if (reduceMotion) return;
  document.querySelectorAll('[data-service]').forEach((row) => {
    gsap.from(row.children, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.07,
      scrollTrigger: { trigger: row, start: 'top 90%', once: true },
    });
  });
}

// Hero: bokstäverna stiger in efter introt och "lossnar" när man scrollar förbi.
export function initHero(gsap, kineticGroups, { heroGate }) {
  const hero = document.querySelector('.hero');
  const title = hero.querySelector('.hero__title');
  const groups = kineticGroups.filter((g) => hero.contains(g.el));
  const chars = groups.flatMap((g) => g.chars.map((c) => c.node));

  if (reduceMotion) {
    title.style.visibility = 'visible';
    return;
  }

  gsap.set(chars, { yPercent: 110 });
  title.style.visibility = 'visible';
  groups.forEach((g) => (g.boost = 1)); // börjar fet...

  heroGate.then(() => {
    gsap.to(chars, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.035 });
    gsap.to(groups, { boost: 0, duration: 1.8, ease: 'power3.inOut', delay: 0.4 }); // ...och blir tunn

    // Scroll: bokstäverna sprids uppåt i olika takt och blir feta igen
    gsap.to(chars, {
      y: (i) => -(40 + ((i * 37) % 7) * 18),
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => groups.forEach((g) => (g.boost = self.progress)),
    });
    gsap.to(hero.querySelector('.hero__bottom'), {
      yPercent: -40,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true },
    });
  });
}
