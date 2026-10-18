/* Local presentation preference only. No cookies, user identifiers or separate preference upload. */
(() => {
  'use strict';
  const key = 'spritfox-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => value === 'light' || value === 'dark';
  const read = () => {
    try { const value = localStorage.getItem(key); return valid(value) ? value : null; }
    catch (_) { return null; }
  };
  let preference = read();
  let effective;
  function apply() {
    effective = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = effective;
    root.classList.add('js');
    document.dispatchEvent(new CustomEvent('spritfox-theme-change'));
  }
  function choose(value) {
    preference = valid(value) ? value : null;
    try {
      if (preference) localStorage.setItem(key, preference);
      else localStorage.removeItem(key);
    } catch (_) { /* Storage unavailable: still work for the current page. */ }
    apply();
  }
  system.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) { preference = read(); apply(); }
  });
  window.SpritFoxTheme = Object.freeze({
    current: () => effective,
    preference: () => preference,
    toggle: () => choose(effective === 'dark' ? 'light' : 'dark'),
    system: () => choose(null)
  });
  apply();
})();
