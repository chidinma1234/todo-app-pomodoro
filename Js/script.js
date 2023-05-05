'use strict';
const html = document.querySelector('html');
const modeToggle = document.querySelector('.mode-toggle');

modeToggle.addEventListener('click', () => {
  if (html.getAttribute('data-color-mode') === 'light') {
    html.setAttribute('data-color-mode', 'dark');
  } else {
    html.setAttribute('data-color-mode', 'light');
  }
});
