(() => {
  'use strict';
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  function apply(theme, save) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const palette = getComputedStyle(document.documentElement);
    document.querySelector('meta[name="theme-color"]').content = palette.getPropertyValue('--bg').trim();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 40 40');
    const rect = document.createElementNS(svg.namespaceURI, 'rect');
    for (const [key, value] of Object.entries({width:40, height:40, rx:8, fill:palette.getPropertyValue('--favicon-bg').trim()})) rect.setAttribute(key, value);
    const letter = document.createElementNS(svg.namespaceURI, 'text');
    for (const [key, value] of Object.entries({x:20, y:29, 'text-anchor':'middle', 'font-family':'Georgia', 'font-size':30, fill:palette.getPropertyValue('--favicon-ink').trim()})) letter.setAttribute(key, value);
    letter.textContent = 'Q';
    svg.append(rect, letter);
    document.querySelector('link[rel="icon"]').href = 'data:image/svg+xml,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
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
