/* Timeline reutilizable (experiencia y estudios). */

import { h } from '../lib/dom.js';
import { duration, formatDate, isoDate } from '../lib/content.js';

/** Bloque de fechas: "ene 2025 – jun 2025" y la duración debajo. */
export function whenBlock(start, end, { showDuration = true } = {}) {
  const from = formatDate(start);
  const to = formatDate(end);
  const dur = showDuration ? duration(start, end) : '';
  return h(
    'p',
    { class: 'timeline__when' },
    from ? h('time', { datetime: isoDate(start) }, from) : null,
    from && to ? ' – ' : null,
    to ? h('time', { datetime: isoDate(end) }, to) : null,
    dur ? h('span', { class: 'timeline__duration' }, dur) : null,
  );
}

/** Lista ordenada con línea de progreso. items: [{ when, content }] */
export function timeline(items, label) {
  return h(
    'ol',
    { class: 'timeline', role: 'list', 'aria-label': label, 'data-timeline': '' },
    items.map(({ when, content }) =>
      h(
        'li',
        { class: 'timeline__item', 'data-reveal': '' },
        when,
        h('span', { class: 'timeline__dot', 'aria-hidden': 'true' }),
        h('div', { class: 'timeline__card' }, content),
      ),
    ),
  );
}
