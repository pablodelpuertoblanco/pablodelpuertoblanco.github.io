/* Piezas animadas: cinta de tecnologías, terminal, panel de datos y demos de proyectos.
   Son decorativas o ilustrativas: el contenido real siempre está también como texto. */

import { h, iconNode, svgEl } from '../lib/dom.js';
import { fullName } from './common.js';

/* ---------- Cinta de tecnologías (bajo el hero) ---------- */
export function techRibbon(data, c) {
  const seen = new Set();
  const items = [];
  for (const group of data.habilidades || []) {
    for (const item of c.list(group.items, 'nombre')) {
      if (c.isPh(item.nombre) || seen.has(item.nombre)) continue;
      seen.add(item.nombre);
      items.push(item);
    }
  }
  if (items.length < 6) return null;

  const run = () =>
    h(
      'ul',
      { class: 'ribbon__run', role: 'list' },
      items.map((item) => h('li', { class: 'ribbon__item' }, iconNode(item.icono, item.nombre), item.nombre)),
    );
  // Dos copias seguidas para que el bucle no tenga costura. Las habilidades se listan
  // completas más abajo, así que la cinta se oculta a los lectores de pantalla.
  return h('div', { class: 'ribbon', 'aria-hidden': 'true', 'data-inview': '' }, h('div', { class: 'ribbon__track' }, run(), run()));
}

/* ---------- Terminal de "Sobre mí" ---------- */
const years = (s) => `${s.inicio}–${s.fin === 'actualidad' ? 'hoy' : s.fin}`;
const acronym = (title = '') => title.match(/\(([A-ZÁÉÍÓÚ0-9]{2,})\)\s*$/)?.[1] || title;

export function terminal(data, c) {
  const { perfil, formacion = {} } = data;
  const host = (perfil.ubicacion || 'web').split(',')[0].trim().toLowerCase();
  const user = (perfil.nombre || 'yo').toLowerCase();
  const prompt = `${user}@${host}:~$`;
  const studies = c.list(formacion.estudios, 'titulo');
  const projects = c.list(data.proyectos, 'nombre').filter((p) => !c.isPh(p.nombre));
  const certs = c.list(formacion.certificaciones, 'nombre').length;

  const blocks = [
    { cmd: 'whoami', out: [`${fullName(perfil)}`, `${perfil.rol}`] },
    studies.length && { cmd: 'cat formacion.txt', out: studies.map((s) => `${years(s).padEnd(10)} ${acronym(s.titulo)} · ${s.centro}`) },
    projects.length && { cmd: 'ls proyectos/', out: [projects.map((p) => `${p.id || p.nombre.toLowerCase()}/`).join('   ')] },
    certs && { cmd: 'ls certificaciones/ | wc -l', out: [String(certs)] },
    perfil.disponible && { cmd: 'ping -c 1 nuevas-oportunidades', out: ['1 paquete enviado, 1 recibido: disponible'] },
  ].filter(Boolean);

  const summary = blocks.map((b) => b.out.join(', ')).join('. ');
  return h(
    'div',
    { class: 'term', role: 'img', 'aria-label': `Terminal que resume mi perfil: ${summary}.`, 'data-terminal': '', 'data-reveal': '' },
    h(
      'div',
      { class: 'term__bar', 'aria-hidden': 'true' },
      h('span', { class: 'term__dots' }, h('i'), h('i'), h('i')),
      h('span', { class: 'term__title' }, `${user}@${host}: ~`),
    ),
    h(
      'div',
      { class: 'term__body', 'aria-hidden': 'true' },
      blocks.map((b) => [
        h('p', { class: 'term__line term__line--cmd' }, h('span', { class: 'term__prompt' }, prompt), ' ', h('span', { class: 'term__cmd', 'data-cmd': '' }, b.cmd)),
        b.out.map((line) => h('p', { class: 'term__line term__line--out', 'data-out': '' }, line)),
      ]),
      h('p', { class: 'term__line term__line--cmd', 'data-last': '' }, h('span', { class: 'term__prompt' }, prompt), ' ', h('span', { class: 'term__caret' })),
    ),
  );
}

/* ---------- Panel de datos (experiencia con Power BI) ---------- */
export function dataPanel() {
  const spark = (d) =>
    svgEl('svg', { class: 'dash__spark', viewBox: '0 0 80 24', preserveAspectRatio: 'none' }, svgEl('path', { d, pathLength: 1 }));
  const kpi = (d) => h('div', { class: 'dash__kpi' }, h('i', { class: 'dash__sk dash__sk--s' }), h('i', { class: 'dash__sk dash__sk--l' }), spark(d));

  return h(
    'figure',
    { class: 'dash', 'data-dash': '', 'data-inview': '' },
    h(
      'div',
      { class: 'dash__frame', 'aria-hidden': 'true' },
      h('div', { class: 'dash__top' }, h('i', { class: 'dash__sk dash__sk--title' }), h('span', { class: 'dash__live' }, h('span', { class: 'led led--blink' }), 'Actualizando')),
      h(
        'div',
        { class: 'dash__kpis' },
        kpi('M0 18 L14 14 L28 16 L42 8 L56 11 L80 3'),
        kpi('M0 8 L14 12 L28 6 L42 14 L56 9 L80 12'),
        kpi('M0 20 L14 17 L28 18 L42 12 L56 7 L80 5'),
      ),
      h(
        'div',
        { class: 'dash__charts' },
        h('div', { class: 'dash__bars' }, [62, 38, 80, 54, 92, 46, 70, 58].map((v, i) => h('i', { style: { '--h': `${v}%`, '--i': i } }))),
        svgEl(
          'svg',
          { class: 'dash__donut', viewBox: '0 0 42 42' },
          svgEl('circle', { class: 'dash__donut-bg', cx: 21, cy: 21, r: 15.9 }),
          svgEl('circle', { class: 'dash__donut-fg', cx: 21, cy: 21, r: 15.9, pathLength: 100 }),
        ),
        svgEl(
          'svg',
          { class: 'dash__line', viewBox: '0 0 200 60', preserveAspectRatio: 'none' },
          svgEl('path', { class: 'dash__area', d: 'M0 46 C20 40 30 48 50 36 S80 30 100 22 S140 30 160 14 S190 12 200 6 L200 60 L0 60Z' }),
          svgEl('path', { class: 'dash__curve', d: 'M0 46 C20 40 30 48 50 36 S80 30 100 22 S140 30 160 14 S190 12 200 6', pathLength: 1 }),
        ),
      ),
    ),
    h('figcaption', { class: 'dash__caption' }, 'Recreación animada de un panel de KPIs. Es ilustrativa: no muestra datos reales.'),
  );
}

/* ---------- Demos de proyecto (portadas animadas) ---------- */
function phone(...screen) {
  return h('div', { class: 'phone' }, h('span', { class: 'phone__notch' }), h('div', { class: 'phone__screen' }, ...screen));
}

function swipeDemo() {
  const card = (mod, stamp) =>
    h(
      'div',
      { class: `swipe-card swipe-card--${mod}` },
      h('div', { class: 'swipe-card__cover' }, h('span', { class: 'eq' }, h('i'), h('i'), h('i'), h('i'), h('i'))),
      h('i', { class: 'sk sk--l' }),
      h('i', { class: 'sk sk--s' }),
      stamp,
    );
  const row = (mod = '') => h('li', { class: `mini-row ${mod}`.trim() }, h('i', { class: 'mini-row__art' }), h('span', {}, h('i', { class: 'sk sk--l' }), h('i', { class: 'sk sk--s' })));
  return h(
    'div',
    { class: 'demo demo--swipe', 'aria-hidden': 'true', 'data-inview': '' },
    phone(
      card('b', h('span', { class: 'stamp stamp--skip' }, '✕')),
      card('a', h('span', { class: 'stamp stamp--like' }, '♥')),
      h('div', { class: 'swipe-actions' }, h('span', { class: 'swipe-btn swipe-btn--skip' }, '✕'), h('span', { class: 'swipe-btn swipe-btn--like' }, '♥')),
    ),
    h('div', { class: 'demo__side' }, h('p', { class: 'demo__side-title' }, 'Tu playlist'), h('ul', { class: 'mini-list', role: 'list' }, row(), row(), row('mini-row--new'))),
  );
}

function financeDemo() {
  const seg = (cls, len, offset) =>
    svgEl('circle', { class: `ring__seg ${cls}`, cx: 21, cy: 21, r: 15.9, pathLength: 100, 'stroke-dasharray': `${len} ${100 - len}`, 'stroke-dashoffset': -offset, style: `--len:${len}` });
  return h(
    'div',
    { class: 'demo demo--finance', 'aria-hidden': 'true', 'data-inview': '' },
    phone(
      h('i', { class: 'sk sk--s' }),
      h('i', { class: 'sk sk--xl' }),
      h('div', { class: 'mini-bars' }, [45, 70, 52, 88, 60, 76].map((v, i) => h('i', { style: { '--h': `${v}%`, '--i': i } }))),
      h('ul', { class: 'mini-list', role: 'list' }, [0, 1, 2].map((i) => h('li', { class: 'mini-row mini-row--in', style: { '--i': i } }, h('i', { class: 'mini-row__art' }), h('span', {}, h('i', { class: 'sk sk--l' }), h('i', { class: 'sk sk--s' }))))),
    ),
    h(
      'div',
      { class: 'demo__side' },
      svgEl('svg', { class: 'ring', viewBox: '0 0 42 42' }, svgEl('circle', { class: 'ring__bg', cx: 21, cy: 21, r: 15.9 }), seg('ring__seg--a', 50, 0), seg('ring__seg--b', 30, 50), seg('ring__seg--c', 20, 80)),
      h(
        'ul',
        { class: 'ring__legend', role: 'list' },
        h('li', { class: 'ring__key ring__key--a' }, '50 necesidades'),
        h('li', { class: 'ring__key ring__key--b' }, '30 deseos'),
        h('li', { class: 'ring__key ring__key--c' }, '20 ahorro'),
      ),
    ),
  );
}

const DEMOS = { swipe: swipeDemo, finanzas: financeDemo };

/** Demo animada de un proyecto según su campo "animacion" (o null si no tiene). */
export function projectDemo(p) {
  return DEMOS[p.animacion]?.() || null;
}
