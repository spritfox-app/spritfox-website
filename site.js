/* Theme controls and genuine screenshot pairing. Native image requests to the website host only; no APIs or analytics. */
(() => {
  'use strict';
  const theme = window.SpritFoxTheme;
  const toggle = document.getElementById('theme-toggle');
  const reset = document.getElementById('theme-reset');
  if (!theme || !toggle || !reset) return;
  function synchronize() {
    const dark = theme.current() === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Hellmodus einschalten' : 'Dunkelmodus einschalten');
    toggle.querySelector('.theme-label').textContent = dark ? 'Dunkel' : 'Hell';
    reset.hidden = theme.preference() === null;
    document.querySelectorAll('source[data-dark-capture]').forEach(source => {
      source.media = dark ? 'all' : 'not all';
    });
    document.querySelectorAll('picture[data-capture] img').forEach(image => {
      image.alt = image.dataset[dark ? 'altDark' : 'altLight'];
    });
  }
  toggle.addEventListener('click', theme.toggle);
  reset.addEventListener('click', () => {
    theme.system();
    toggle.focus({preventScroll: true});
  });
  document.addEventListener('spritfox-theme-change', synchronize);
  synchronize();
})();
