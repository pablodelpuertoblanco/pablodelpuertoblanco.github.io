import { h, iconNode, safeUrl } from '../lib/dom.js';
import { section, sectionHead } from './common.js';
import { timeline, whenBlock } from './timeline.js';
import { placeChip } from './places.js';

function certItem(cert, c) {
  const url = c.has(cert.url) && !c.isPh(cert.url) ? safeUrl(cert.url) : null;
  const meta = [cert.emisor, cert.fecha].filter((v) => c.has(v));
  return h(
    'li',
    { class: 'cert', 'data-reveal': '' },
    h('span', { class: 'cert__icon', 'aria-hidden': 'true' }, iconNode(cert.icono || 'award')),
    h(
      'div',
      {},
      h('h4', { class: 'cert__name' }, c.text(cert.nombre)),
      meta.length
        ? h('p', { class: 'cert__meta' }, meta.map((m, i) => [i ? ', ' : null, c.text(m)]))
        : null,
      url
        ? h('a', { class: 'cert__link', href: url, target: '_blank', rel: 'noopener noreferrer' }, 'Ver credencial', iconNode('external-link'))
        : null,
    ),
  );
}

export function renderEducation(data, c) {
  const { formacion = {} } = data;
  const studies = c.list(formacion.estudios, 'titulo');
  const certs = c.list(formacion.certificaciones, 'nombre');
  const courses = c.list(formacion.cursos, 'nombre');
  if (!studies.length && !certs.length && !courses.length) return null;

  const credentials = (title, items) =>
    items.length
      ? h('div', {}, h('h3', { class: 'education__subtitle' }, title), h('ul', { class: 'certs', role: 'list' }, items.map((x) => certItem(x, c))))
      : null;

  return section(
    { id: 'formacion', labelledBy: 'edu-title', className: 'education' },
    sectionHead({
      title: 'Formación',
      id: 'edu-title',
      lead: 'Estudios oficiales, certificaciones y cursos.',
    }),
    h(
      'div',
      { class: 'education__grid' },
      studies.length
        ? h(
            'div',
            {},
            h('h3', { class: 'education__subtitle' }, 'Estudios'),
            timeline(
              studies.map((s) => ({
                when: whenBlock(s.inicio, s.fin, { showDuration: false }),
                content: [
                  h('h4', { class: 'timeline__title' }, c.text(s.titulo)),
                  h('p', { class: 'timeline__org' }, iconNode('graduation-cap'), h('span', {}, c.text(s.centro))),
                  placeChip(s.centro, s.lugar),
                  c.has(s.descripcion) ? h('p', { class: 'timeline__desc' }, c.text(s.descripcion)) : null,
                ],
              })),
              'Estudios',
            ),
          )
        : null,
      h('div', { class: 'education__creds' }, credentials('Certificaciones', certs), credentials('Cursos', courses)),
    ),
  );
}
