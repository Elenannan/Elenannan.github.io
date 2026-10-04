(() => {
  'use strict';
  let theme = 'light';
  try {
    const saved = localStorage.getItem('qimin-theme');
    if (saved === 'dark' || saved === 'light') theme = saved;
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
})();
