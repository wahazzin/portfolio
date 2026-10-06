// =====================================================================
// INTRO / PRELOADER (max ~1.8 s)
// Namnet stiger upp bakom masker, en räknare går till 100, sen torkas
// hela ytan uppåt och hero tar över. Klick/tangent hoppar över.
// Visas bara första besöket i fliken (sessionStorage).
// =====================================================================

export function runIntro(gsap, onReveal) {
  const root = document.documentElement;
  const intro = document.querySelector('.intro');
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    onReveal();
  };

  if (!root.classList.contains('has-intro') || !intro) {
    reveal();
    return;
  }

  const words = intro.querySelectorAll('.intro__word');
  const num = intro.querySelector('.intro__num');
  const counter = { v: 0 };

  const finish = () => {
    root.classList.remove('has-intro');
    try {
      sessionStorage.setItem('ya-intro', '1');
    } catch (e) {}
    cleanup();
  };

  const tl = gsap.timeline({ onComplete: finish });
  tl.fromTo(words, { y: 0, yPercent: 105 }, { yPercent: 0, duration: 0.85, ease: 'expo.out', stagger: 0.08 }, 0)
    .to(counter, {
      v: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => (num.textContent = Math.round(counter.v)),
    }, 0)
    .to(words, { yPercent: -110, duration: 0.55, ease: 'expo.in', stagger: 0.04 }, 1.0)
    .fromTo(intro,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut' },
      1.1)
    .call(reveal, null, 1.3);

  // Hoppa över: spola snabbt fram (inte ett hårt klipp)
  const skip = () => {
    if (tl.progress() < 0.95) tl.timeScale(5);
  };
  const cleanup = () => {
    window.removeEventListener('keydown', skip);
    intro.removeEventListener('click', skip);
    window.removeEventListener('wheel', skip);
  };
  window.addEventListener('keydown', skip);
  intro.addEventListener('click', skip);
  window.addEventListener('wheel', skip, { passive: true });
}
