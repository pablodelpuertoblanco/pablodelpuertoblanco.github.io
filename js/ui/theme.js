/* Tema claro/oscuro. La preferencia se guarda en este navegador. */

const KEY = 'theme';

function stored() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function save(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* sin almacenamiento: el cambio dura hasta recargar */
  }
}

function apply(theme, button) {
  document.documentElement.dataset.theme = theme;
  const next = theme === 'dark' ? 'claro' : 'oscuro';
  if (button) {
    button.setAttribute('aria-label', `Cambiar a modo ${next}`);
    button.setAttribute('title', `Modo ${next}`);
  }
  const meta = document.querySelectorAll('meta[name="theme-color"]');
  const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  meta.forEach((m) => m.setAttribute('content', color));
}

export function initTheme(defaultTheme = 'oscuro') {
  const button = document.querySelector('.theme-toggle');
  const initial = stored() || (defaultTheme === 'claro' ? 'light' : 'dark');
  apply(initial, button);

  button?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next, button);
    save(next);
  });
}
