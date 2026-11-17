import { h, iconNode } from '../lib/dom.js';
import { NAV, fullName, linkButton, profileLinks } from './common.js';

export function renderFooter(data, c, sections) {
  const { perfil, footer = {} } = data;
  const year = new Date().getFullYear();
  const nav = NAV.filter((n) => sections.includes(n.id));
  if (sections.includes('cv')) nav.push({ id: 'cv', label: 'Currículum' });

  return h(
    'footer',
    { class: 'site-footer' },
    h(
      'div',
      { class: 'container footer__grid' },
      h(
        'div',
        {},
        h('p', { class: 'footer__name' }, fullName(perfil)),
        c.has(footer.mensaje) ? h('p', { class: 'footer__msg' }, c.text(footer.mensaje)) : null,
      ),
      h(
        'nav',
        { class: 'footer__nav', 'aria-label': 'Secciones' },
        h('ul', { role: 'list' }, nav.map((n) => h('li', {}, h('a', { href: `#${n.id}` }, n.label)))),
      ),
      h(
        'ul',
        { class: 'footer__social', role: 'list', 'aria-label': 'Perfiles profesionales' },
        profileLinks(data, c).map((l) => h('li', {}, linkButton(l))),
      ),
    ),
    h(
      'div',
      { class: 'container footer__bottom' },
      h('p', {}, `© ${year} ${fullName(perfil)}`),
      h('a', { class: 'to-top', href: '#inicio' }, iconNode('arrow-up'), 'Volver arriba'),
    ),
  );
}
