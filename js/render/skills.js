import { h, iconNode } from '../lib/dom.js';
import { section, sectionHead } from './common.js';

function port(item, c) {
  const ph = c.isPh(item.nombre);
  return h(
    'li',
    {
      class: `port ${ph ? 'is-placeholder' : ''}`.trim(),
      title: ph ? 'Edítalo en data/portfolio.js' : null,
    },
    h('span', { class: 'port__icon' }, iconNode(item.icono, c.plain(item.nombre))),
    h('span', { class: 'port__name' }, c.text(item.nombre)),
    h('span', { class: 'led port__led', 'aria-hidden': 'true' }),
  );
}

function skillsPanel(groups, c) {
  return h(
    'div',
    { class: 'panel', 'data-reveal': '' },
    groups.map((group) => {
      const titleId = `skill-${group.categoria.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`;
      return h(
        'div',
        { class: 'panel__row' },
        h('h3', { class: 'panel__label', id: titleId }, iconNode(group.icono, group.categoria), group.categoria),
        h(
          'ul',
          { class: 'panel__ports', role: 'list', 'aria-labelledby': titleId },
          c.list(group.items, 'nombre').map((item) => port(item, c)),
        ),
      );
    }),
  );
}

function toolItem(item, c) {
  const ph = c.isPh(item.nombre);
  return h(
    'li',
    { class: `tool ${ph ? 'is-placeholder' : ''}`.trim() },
    h('span', { class: 'tool__icon', 'aria-hidden': 'true' }, iconNode(item.icono, c.plain(item.nombre))),
    h(
      'div',
      {},
      h('h4', { class: 'tool__name' }, c.text(item.nombre)),
      c.has(item.descripcion) ? h('p', { class: 'tool__desc' }, c.text(item.descripcion)) : null,
    ),
  );
}

function toolsBlock(groups, c) {
  return h(
    'div',
    { class: 'tools', id: 'herramientas' },
    sectionHead({
      title: 'Software que uso',
      id: 'tools-title',
      level: 'h2',
      className: 'tools__head',
      lead: 'Los programas con los que trabajo y para qué los uso.',
    }),
    groups.map((group) =>
      h(
        'div',
        { class: 'tools__group', 'data-reveal': '' },
        h('h3', { class: 'tools__group-title' }, group.categoria),
        h('ul', { class: 'tools__list', role: 'list' }, c.list(group.items, 'nombre').map((i) => toolItem(i, c))),
      ),
    ),
  );
}

export function renderSkills(data, c) {
  const skillGroups = (data.habilidades || []).filter((g) => c.list(g.items, 'nombre').length);
  const toolGroups = (data.herramientas || []).filter((g) => c.list(g.items, 'nombre').length);
  if (!skillGroups.length && !toolGroups.length) return null;

  return section(
    { id: 'habilidades', labelledBy: 'skills-title', className: 'skills' },
    sectionHead({
      title: 'Habilidades',
      id: 'skills-title',
      lead: 'Lenguajes, tecnologías y sistemas con los que he trabajado, ordenados por área.',
    }),
    skillGroups.length ? skillsPanel(skillGroups, c) : null,
    toolGroups.length ? toolsBlock(toolGroups, c) : null,
  );
}
