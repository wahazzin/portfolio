// =====================================================================
// TEXT-AVSLÖJANDEN – läsbarhet går alltid före effekt.
// Regler:
//  - Text animeras bara IN, en gång (once: true). Den göms aldrig igen.
//  - Mobil (< 768 px): INGA intoningar av text alls – texten finns bara där.
//    (Mobilen får egna effekter i touch.js som aldrig döljer text.)
//  - Desktop: rad-för-rad bakom masker, startar när texten kommer in i bild
//    och är klar långt innan den når mitten.
//  - Ingen scroll-styrd nedtoning av riktig text.
// [data-reveal-lines]  -> rubriker/stycken
// [data-scrub-words]   -> "Om mig": full benvit text; orden lyses bara UPP (vit + glöd) på desktop
// [data-service]       -> tjänsteraderna
// =====================================================================
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

    if (isMobile()) return; // mobil: ingen intoning

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

// "Om mig": texten är ALLTID full benvit (--paper, ca 16:1 mot bakgrunden).
// På desktop lyses orden upp ett i taget till rent vitt med en svag koboltglöd.
// Effekten kan bara göra orden ljusare – aldrig mörkare än basen, åt något håll.
export function initScrubWords(gsap, SplitText) {
  document.querySelectorAll('[data-scrub-words]').forEach((el) => {
    show(el);
    if (reduceMotion || isMobile()) return;
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word', aria: 'none' });
    gsap.to(split.words, {
      color: '#ffffff',
      textShadow: '0 0 18px rgba(47, 75, 255, 0.9)',
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
    });
  });
}

export function initServices(gsap) {
  if (reduceMotion || isMobile()) return; // mobil: tjänsterna syns direkt
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

// Kontakt-finalen: när mejladressen kommer in i bild "scramblas" bokstäverna
// i max 0.6 s och landar sedan på rätt plats – en gång. Länken har aria-label med
// adressen, så skärmläsare får den direkt, och Kopiera-knappen kopierar alltid rätt.
export function initContactEmail(gsap, kineticGroups) {
  if (reduceMotion) return;
  const email = document.querySelector('.contact__email');
  if (!email) return;
  const chars = kineticGroups.filter((g) => email.contains(g.el)).flatMap((g) => g.chars.map((c) => c.node));
  const real = chars.map((n) => n.textContent);
  const pool = 'abcdefghijklmnopqrstuvwxyz';
  const state = { p: 0 };
  ScrollTrigger.create({
    trigger: email,
    start: 'top 85%',
    once: true,
    onEnter: () =>
      gsap.to(state, {
        p: 1,
        duration: 0.6,
        ease: 'none',
        onUpdate: () => {
          chars.forEach((n, i) => {
            // varje bokstav landar vid sin egen tidpunkt (vänster till höger)
            const settleAt = 0.25 + (i / chars.length) * 0.75;
            const ch = state.p >= settleAt || real[i] === '@' || real[i] === '.'
              ? real[i]
              : pool[(Math.random() * pool.length) | 0];
            if (n.textContent !== ch) n.textContent = ch;
          });
        },
        onComplete: () => chars.forEach((n, i) => (n.textContent = real[i])),
      }),
  });
}
