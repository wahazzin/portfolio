// =====================================================================
// KONTAKT + FOOTER: kopiera mejl, lokal tid i Malmö, årtal.
// =====================================================================

export function initCopy() {
  const status = document.querySelector('.contact__status');
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('.btn__text');
    const original = label.textContent;
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(value);
        ok = true;
      } catch (e) {
        // reserv för äldre webbläsare / osäkra sammanhang
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand('copy');
        } catch (err) {}
        ta.remove();
      }
      label.textContent = ok ? 'Kopierad!' : value;
      if (status) status.textContent = ok ? `${value} är kopierad.` : `Kopiera adressen: ${value}`;
      clearTimeout(btn._t);
      btn._t = setTimeout(() => {
        label.textContent = original;
        if (status) status.textContent = '';
      }, 2400);
    });
  });
}

export function initClock() {
  const els = document.querySelectorAll('[data-clock]');
  const full = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const short = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    hour: '2-digit',
    minute: '2-digit',
  });
  const tick = () => {
    const now = new Date();
    els.forEach((el) => {
      el.textContent = ('clockShort' in el.dataset ? short : full).format(now);
    });
  };
  tick();
  setInterval(tick, 1000);
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}
