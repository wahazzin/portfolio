// =====================================================================
// TEXT-AVSLÖJANDEN – läsbarhet går alltid före effekt.
// Regler:
//  - Text animeras bara IN, en gång (once: true). Den göms aldrig igen.
//  - Mobil (< 768 px): ingen mask. Hela stycket tonas in snabbt (≤ 0.5 s).
//  - Desktop: rad-för-rad bakom masker, startar tidigt (92 % ner på skärmen)
//    och är klar långt innan texten når mitten.
//  - Ingen scroll-styrd nedtoning av riktig text.
// [data-reveal-lines]  -> rubriker/stycken
// [data-scrub-words]   -> "Om mig": orden blir LJUSARE när man scrollar (bas = läsbar grå)
// [data-service]       -> tjänsteraderna
// =====================================================================
import { reduceMotion } from './env.js';

const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
const show = (el) => (el.style.visibility = 'visible');
// Intoningar startar så fort elementet kommer in i bild, så de hinner bli klara
// långt innan texten når läsytan. Maskade rader (desktop) startar nästan lika tidigt.
const START = 'top bottom';
const MASK_START = 'top 96%';

// Enkel, snabb intoning (mobil + allt som inte ska maskas)
export function fadeIn(gsap, targets, trigger, opts = {}) {
  return gsap.from(targets, {
    opacity: 0,
    y: 12,
    duration: 0.3,
    ease: 'power2.out',
    stagger: 0.04,
    clearProps: 'opacity,transform',
    scrollTrigger: trigger ? { trigger, start: START, once: true } : undefined,
    ...opts,
  });
}

export function initLineReveals(gsap, SplitText) {
  document.querySelectorAll('[data-reveal-lines]').forEach((el) => {
    show(el);
    if (reduceMotion) return;

    if (isMobile()) {
      fadeIn(gsap, el, el);
      return;
    }

    let played = false; // spela bara en gång, även om texten delas om vid resize
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      aria: 'none', // <p> får inte ha aria-label; texten är ändå läsbar
      autoSplit: true,
      onSplit(self) {
        if (played) return;
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: MASK_START, once: true },
          onStart: () => (played = true),
        });
      },
    });
  });
}

// "Om mig": basfärgen är --muted (7.6:1 mot bakgrunden, alltid läsbar).
// Ord för ord blir de ljusare (--paper) när man scrollar. Aldrig mörkare än basen.
export function initScrubWords(gsap, SplitText) {
  document.querySelectorAll('[data-scrub-words]').forEach((el) => {
    show(el);
    if (reduceMotion) return;
    el.classList.add('is-highlight');
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word', aria: 'none' });
    gsap.to(split.words, {
      color: '#eeece6',
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true },
    });
  });
}

export function initServices(gsap) {
  if (reduceMotion) return;
  document.querySelectorAll('[data-service]').forEach((row) => fadeIn(gsap, row.children, row));
}

// Hero: namnet kommer in efter introt. Beskrivning och knapp är alltid fullt synliga.
export function initHero(gsap, kineticGroups, { heroGate }) {
  const hero = document.querySelector('.hero');
  const title = hero.querySelector('.hero__title');
  const groups = kineticGroups.filter((g) => hero.contains(g.el));
  const chars = groups.flatMap((g) => g.chars.map((c) => c.node));

  if (reduceMotion) {
    title.style.visibility = 'visible';
    return;
  }

  const mobile = isMobile();
  // Mobil: tona in hela namnet. Desktop: bokstäverna stiger upp bakom linjen.
  if (mobile) gsap.set(chars, { opacity: 0, y: 20 });
  else gsap.set(chars, { yPercent: 110 });
  title.style.visibility = 'visible';
  groups.forEach((g) => (g.boost = 1)); // börjar fet...

  heroGate.then(() => {
    if (mobile) {
      gsap.to(chars, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.02 });
    } else {
      gsap.to(chars, {
        yPercent: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.03,
        // när bokstäverna är på plats tas masken bort, så inget klipps vid scroll
        onComplete: () => title.classList.add('is-settled'),
      });
      // Scroll (bara desktop): bokstäverna glider isär uppåt när hero lämnar skärmen
      gsap.to(chars, {
        y: (i) => -(30 + ((i * 37) % 7) * 12),
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }
    gsap.to(groups, { boost: 0, duration: 1.6, ease: 'power3.inOut', delay: 0.3 }); // ...och blir tunn
  });
}

// Kontakt-finalen: mejladressen tonas in en gång och stannar sedan.
// (Bokstäverna "lever" ändå via den variabla vikten – muspekare på desktop, våg på mobil.)
export function initContactEmail(gsap) {
  if (reduceMotion) return;
  const email = document.querySelector('.contact__email');
  if (email) fadeIn(gsap, email, email);
}
