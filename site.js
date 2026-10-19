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

/* Progressive enhancement: radios also work without JavaScript. */
(() => {
  'use strict';
  const demo = document.querySelector('.phone-demo');
  if (!demo) return;
  const choices = [...demo.querySelectorAll('input[name="app-preview"]')];
  const navigation = demo.querySelector('.preview-navigation');
  const position = demo.querySelector('.preview-position');
  if (!choices.length || !navigation || !position) return;
  function synchronize() {
    const index = choices.findIndex(choice => choice.checked);
    if (index < 0) return;
    const title = demo.querySelector(`label[for="${choices[index].id}"]`).textContent.trim();
    position.textContent = `${index + 1} von ${choices.length} · ${title}`;
    demo.querySelectorAll('.app-panel').forEach(panel => {
      panel.setAttribute('aria-hidden', String(panel.dataset.view !== choices[index].value));
    });
  }
  choices.forEach(choice => choice.addEventListener('change', synchronize));
  navigation.querySelectorAll('[data-preview-step]').forEach(button => {
    button.addEventListener('click', () => {
      const current = choices.findIndex(choice => choice.checked);
      const next = (current + Number(button.dataset.previewStep) + choices.length) % choices.length;
      choices.forEach((choice, index) => { choice.checked = index === next; });
      synchronize();
    });
  });
  navigation.hidden = false;
  synchronize();
})();
