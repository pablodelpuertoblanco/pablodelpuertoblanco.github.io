import { h, iconNode, safeUrl } from '../lib/dom.js';
import { NAV, brandMark, fullName } from './common.js';

export function renderHeader(data, c, sections) {
  const { perfil, cv } = data;
  const short = [perfil.nombre, (perfil.apellidos || '').split(' ').slice(0, 2).join(' ')]
    .filter(Boolean)
    .join(' ');

  const links = NAV.filter((item) => sections.includes(item.id)).map((item) =>
    h('li', {}, h('a', { class: 'site-nav__link', href: `#${item.id}` }, item.label)),
  );

  const themeBtn = h(
    'button',
    { class: 'icon-btn theme-toggle', type: 'button', 'aria-label': 'Cambiar tema' },
    h('span', { class: 'icon-moon' }, iconNode('moon')),
    h('span', { class: 'icon-sun' }, iconNode('sun')),
  );

  const cvHref = safeUrl(cv?.archivo);

  return h(
    'header',
    { class: 'site-header' },
    h(
      'div',
      { class: 'container site-header__inner' },
      h(
        'a',
        { class: 'brand', href: '#inicio', 'aria-label': `${fullName(perfil)}, ir al inicio` },
        brandMark(),
        h('span', { class: 'brand__name' }, short),
      ),
      h(
        'nav',
        { class: 'site-nav', id: 'site-nav', 'aria-label': 'Principal' },
        h('ul', { class: 'site-nav__list', role: 'list' }, links),
      ),
      h(
        'div',
        { class: 'site-header__actions' },
        themeBtn,
        cvHref
          ? h(
              'a',
              {
                class: 'btn btn--primary btn--small',
                href: cvHref,
                download: cv.nombreDescarga || true,
                type: 'application/pdf',
              },
              iconNode('download'),
              'CV',
            )
          : null,
        h(
          'button',
          {
            class: 'icon-btn nav-toggle',
            type: 'button',
            'aria-expanded': 'false',
            'aria-controls': 'site-nav',
            'aria-label': 'Abrir menú',
          },
          h('span', { class: 'nav-toggle__open' }, iconNode('menu')),
          h('span', { class: 'nav-toggle__close' }, iconNode('close')),
        ),
      ),
    ),
  );
}
