// =====================================================================
// Startpunkt. Allt rörligt sätts upp här, modul för modul.
// =====================================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { reduceMotion, finePointer } from './js/env.js';
import { runIntro } from './js/intro.js';
import { initHeroBg } from './js/hero-bg.js';
import { initKinetic } from './js/kinetic.js';
import { initLineReveals, initScrubWords, initServices, initHero, initContactEmail } from './js/reveals.js';
import { initMarquee } from './js/marquee.js';
import { initProjects } from './js/projects.js';
import { initCursor, initMagnetic } from './js/cursor.js';
import { initCopy, initClock } from './js/contact.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ---------- Mjuk scroll (Lenis) – aldrig vid reducerad rörelse ----------
let lenis = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Ankarlänkar (#projekt osv.) scrollar mjukt och flyttar fokus för tangentbordet
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.4 });
    else target.scrollIntoView();
    const focusEl = id === '#top' ? document.querySelector('.header__logo') : target;
    if (!focusEl.hasAttribute('tabindex') && !focusEl.matches('a, button')) focusEl.setAttribute('tabindex', '-1');
    focusEl.focus({ preventScroll: true });
    history.replaceState(null, '', id);
  });
});

// ---------- Header ----------
// - Får en solid, suddig bakgrund så fort sidan har scrollats (ligger aldrig "naket" över text).
// - Göms först efter 60 px nedåt och visas först efter 60 px uppåt (inga ryck vid små rörelser).
const header = document.querySelector('.header');
const THRESHOLD = 60;
let anchorY = window.scrollY;
let hidden = false;
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-solid', y > 10);
  if (y < 120) {
    hidden = false;
    anchorY = y;
  } else if (!hidden && y - anchorY > THRESHOLD) {
    hidden = true;
    anchorY = y;
  } else if (hidden && anchorY - y > THRESHOLD) {
    hidden = false;
    anchorY = y;
  } else if ((hidden && y > anchorY) || (!hidden && y < anchorY)) {
    anchorY = y; // fortsätter åt samma håll: flytta referenspunkten
  }
  header.classList.toggle('is-hidden', hidden);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Intro -> hero ----------
let openGate;
const heroGate = new Promise((r) => (openGate = r));

const start = () => {
  if (lenis && document.documentElement.classList.contains('has-intro')) lenis.stop();
  runIntro(gsap, () => {
    if (lenis) lenis.start();
    openGate();
  });

  initHeroBg(document.querySelector('.hero__canvas'), gsap);
  const kinetic = initKinetic(gsap);
  initHero(gsap, kinetic, { heroGate });
  initLineReveals(gsap, SplitText);
  initScrubWords(gsap, SplitText);
  initServices(gsap);
  initProjects(gsap);
  initContactEmail(gsap);
  if (!reduceMotion) initMarquee(gsap, ScrollTrigger);
  if (finePointer && !reduceMotion) {
    initCursor(gsap);
    initMagnetic(gsap);
  }
  initCopy();
  initClock();
  ScrollTrigger.refresh();
};

// Vänta på typsnitten så att raduppdelning och mått blir rätt (men max 1.5 s)
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(start);
