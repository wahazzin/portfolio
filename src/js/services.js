// =====================================================================
// TJÄNSTERADER -> KONTAKT
// Klick på en tjänst hoppar till Kontakt och fyller i mejlets ämnesrad,
// t.ex. "Förfrågan: Hemsida". Ämnet kan tas bort igen.
// =====================================================================
const EMAIL = 'wahazzin@gmail.com';

export function initServiceLinks(scrollToEl) {
  const subjectBox = document.querySelector('.contact__subject');
  const subjectText = document.querySelector('.contact__subject-text');
  const mailLinks = document.querySelectorAll('[data-mailto]');
  const sendBtn = document.querySelector('.contact__actions [data-mailto]');
  const contact = document.querySelector('#kontakt');

  const setSubject = (subject) => {
    const href = subject ? `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` : `mailto:${EMAIL}`;
    mailLinks.forEach((a) => (a.href = href));
    subjectBox.hidden = !subject;
    subjectText.textContent = subject || '';
  };

  document.querySelectorAll('.service__link').forEach((btn) => {
    btn.addEventListener('click', () => {
      setSubject(btn.dataset.subject);
      scrollToEl(contact);
      // fokus till knappen som skickar mejlet (utan att hoppa i sidan)
      sendBtn.focus({ preventScroll: true });
    });
  });
  document.querySelector('.contact__subject-clear').addEventListener('click', () => {
    setSubject('');
    sendBtn.focus();
  });
}
