(() => {
  'use strict';
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  function apply(theme, save) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to day mode' : 'Switch to night mode');
    button.title = dark ? 'Switch to day mode' : 'Switch to night mode';
    if (save) {
      try { localStorage.setItem('qimin-theme', dark ? 'dark' : 'light'); } catch (_) {}
    }
  }
  apply(document.documentElement.dataset.theme, false);
  button.hidden = false;
  button.addEventListener('click', () => apply(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));
  window.addEventListener('storage', event => {
    if (event.key === 'qimin-theme' || event.key === null) apply(event.newValue === 'dark' ? 'dark' : 'light', false);
  });
  window.addEventListener('pageshow', () => {
    try { apply(localStorage.getItem('qimin-theme') === 'dark' ? 'dark' : 'light', false); } catch (_) {}
  });
})();
