import { h, iconNode, safeUrl } from '../lib/dom.js';
import { section, sectionHead, tagList } from './common.js';
import { timeline, whenBlock } from './timeline.js';
import { placeChip } from './places.js';
import { dataPanel } from './visuals.js';

function experienceContent(job, c, animated) {
  const responsibilities = c.list(job.responsabilidades);
  const wins = c.list(job.logros);
  const url = safeUrl(job.url);

  return [
    h('h3', { class: 'timeline__title' }, c.text(job.puesto)),
    h(
      'p',
      { class: 'timeline__org' },
      iconNode('building'),
      h(
        'span',
        {},
        url
          ? h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, c.text(job.empresa))
          : c.text(job.empresa),
        c.has(job.ubicacion) ? [', ', c.text(job.ubicacion)] : null,
      ),
    ),
    placeChip(job.empresa, job.lugar),
    c.has(job.descripcion) ? h('p', { class: 'timeline__desc' }, c.text(job.descripcion)) : null,
    animated && job.visual === 'panel-datos' ? dataPanel() : null,
    responsibilities.length
      ? [
          h('h4', { class: 'timeline__subhead' }, 'Responsabilidades'),
          h('ul', { class: 'timeline__list' }, responsibilities.map((r) => h('li', {}, c.text(r)))),
        ]
      : null,
    wins.length
      ? [
          h('h4', { class: 'timeline__subhead' }, 'Logros'),
          h('ul', { class: 'timeline__list timeline__list--wins' }, wins.map((w) => h('li', {}, c.text(w)))),
        ]
      : null,
    tagList(job.tecnologias, c),
  ];
}

export function renderExperience(data, c) {
  const jobs = c.list(data.experiencia, 'puesto');
  if (!jobs.length) return null;

  return section(
    { id: 'experiencia', labelledBy: 'exp-title', className: 'experience' },
    sectionHead({
      title: 'Experiencia',
      id: 'exp-title',
      lead: 'Dónde he trabajado y qué he construido.',
    }),
    timeline(
      jobs.map((job) => ({ when: whenBlock(job.inicio, job.fin), content: experienceContent(job, c, data.ajustes?.animaciones !== false) })),
      'Experiencia profesional',
    ),
  );
}
