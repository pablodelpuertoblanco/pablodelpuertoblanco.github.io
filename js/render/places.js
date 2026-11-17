/* Recorrido: plano esquemático de Madrid con los sitios donde he estudiado y trabajado,
   y el mapa real de Google Maps de cada uno (se carga solo cuando el visitante lo pide). */

import { h, iconNode, svgEl } from '../lib/dom.js';
import { formatDate } from '../lib/content.js';
import { section, sectionHead } from './common.js';

/* ---------- Datos ---------- */

/** Clave para ordenar: los estudios con solo el año empiezan en septiembre (curso escolar). */
function sortKey(inicio, tipo) {
  const value = String(inicio || '');
  return value.includes('-') ? value : `${value}-${tipo === 'estudios' ? '09' : '01'}`;
}

/** Siglas entre paréntesis del título: "… en Red (ASIR)" → "ASIR". */
function shortTitle(title = '') {
  return title.match(/\(([A-ZÁÉÍÓÚ0-9]{2,})\)\s*$/)?.[1] || title;
}

/** Sitios con ubicación, del más antiguo al más reciente. */
export function collectPlaces(data, c) {
  const out = [];
  for (const s of c.list(data.formacion?.estudios, 'titulo')) {
    if (!s.lugar?.lat) continue;
    out.push({ tipo: 'estudios', icono: 'graduation-cap', nombre: s.centro, que: shortTitle(s.titulo), detalle: s.titulo, inicio: s.inicio, fin: s.fin, lugar: s.lugar });
  }
  for (const j of c.list(data.experiencia, 'puesto')) {
    if (!j.lugar?.lat) continue;
    out.push({ tipo: 'trabajo', icono: 'briefcase', nombre: j.empresa, que: j.puesto, detalle: j.puesto, inicio: j.inicio, fin: j.fin, lugar: j.lugar });
  }
  out.sort((a, b) => sortKey(a.inicio, a.tipo).localeCompare(sortKey(b.inicio, b.tipo)));
  return out.map((p, i) => ({ ...p, id: placeId(p.nombre), n: i + 1 }));
}

export function placeId(name = '') {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ---------- Enlaces de Google Maps (Maps URLs, sin clave de API) ---------- */
const query = (p) => encodeURIComponent(`${p.nombre}, ${p.lugar.direccion}`);

export const mapsLinks = (p) => ({
  abrir: `https://www.google.com/maps/search/?api=1&query=${query(p)}${p.lugar.placeId ? `&query_place_id=${encodeURIComponent(p.lugar.placeId)}` : ''}`,
  ruta: `https://www.google.com/maps/dir/?api=1&destination=${query(p)}${p.lugar.placeId ? `&destination_place_id=${encodeURIComponent(p.lugar.placeId)}` : ''}`,
  incrustado: `https://www.google.com/maps?q=${query(p)}&z=16&hl=es&output=embed`,
});

/** Botón de ubicación para las tarjetas del timeline: lleva al sitio en el recorrido. */
export function placeChip(nombre, lugar) {
  if (!lugar?.lat) return null;
  return h(
    'button',
    { class: 'timeline__place', type: 'button', 'data-goto-place': placeId(nombre), 'aria-label': `Ver ${nombre} en el mapa: ${lugar.direccion}` },
    iconNode('map-pin'),
    h('span', {}, lugar.direccion),
  );
}

/* ---------- Plano esquemático ---------- */
const W = 600;
const H = 520;
const BOUNDS = { west: -3.8, east: -3.559, north: 40.495, south: 40.335 };

/** Proyección simple latitud/longitud → coordenadas del plano. */
function project(lat, lng) {
  const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;
  return [x, y];
}

/** Curva suave que pasa por los puntos (Catmull-Rom convertida a Bézier). */
function smoothPath(points, closed = false) {
  const p = points.map(([lat, lng]) => project(lat, lng));
  const n = p.length;
  const at = (i) => (closed ? p[(i + n) % n] : p[Math.min(n - 1, Math.max(0, i))]);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return closed ? `${d}Z` : d;
}

// Referencias aproximadas de Madrid (solo para orientarse; no es un mapa a escala exacta)
const M30 = [
  [40.474, -3.7], [40.478, -3.672], [40.455, -3.66], [40.432, -3.658], [40.405, -3.662],
  [40.39, -3.674], [40.385, -3.692], [40.392, -3.708], [40.402, -3.722], [40.418, -3.727],
  [40.44, -3.736], [40.458, -3.738], [40.47, -3.722],
];
const RIO = [
  [40.497, -3.752], [40.478, -3.746], [40.455, -3.744], [40.432, -3.733], [40.415, -3.722], [40.402, -3.716],
  [40.392, -3.703], [40.38, -3.688], [40.36, -3.672], [40.34, -3.655], [40.33, -3.64],
];
const CASA_DE_CAMPO = [
  [40.44, -3.748], [40.432, -3.772], [40.415, -3.785], [40.402, -3.768], [40.405, -3.74], [40.42, -3.735],
];
const RETIRO = [[40.42, -3.688], [40.42, -3.678], [40.408, -3.678], [40.408, -3.688]];
const SOL = [40.4169, -3.7035];
// Carreteras radiales: del centro hacia fuera (dirección aproximada)
const RADIALES = [
  ['A-1', [40.478, -3.672], [40.497, -3.655]],
  ['A-2', [40.44, -3.66], [40.452, -3.575]],
  ['A-3', [40.405, -3.662], [40.372, -3.575]],
  ['A-4', [40.388, -3.682], [40.333, -3.692]],
  ['A-5', [40.408, -3.724], [40.378, -3.8]],
  ['A-6', [40.44, -3.736], [40.458, -3.8]],
];

/** Trayecto entre dos sitios, con una ligera curva para que no parezca una regla. */
function hop(a, b, bend) {
  const [x1, y1] = project(a.lugar.lat, a.lugar.lng);
  const [x2, y2] = project(b.lugar.lat, b.lugar.lng);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function plan(places) {
  const [sx, sy] = project(...SOL);
  const label = (text, lat, lng, extra = {}) => {
    const [x, y] = project(lat, lng);
    return svgEl('text', { class: 'plan__label', x: x.toFixed(1), y: y.toFixed(1), ...extra }, text);
  };

  const svg = svgEl(
    'svg',
    { class: 'plan__svg', viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true', focusable: 'false' },
    svgEl('path', { class: 'plan__park', d: smoothPath(CASA_DE_CAMPO, true) }),
    svgEl('path', { class: 'plan__park', d: smoothPath(RETIRO, true) }),
    RADIALES.map(([, from, to]) => {
      const [x1, y1] = project(...from);
      const [x2, y2] = project(...to);
      return svgEl('line', { class: 'plan__road', x1, y1, x2, y2 });
    }),
    svgEl('path', { class: 'plan__river', d: smoothPath(RIO) }),
    svgEl('path', { class: 'plan__ring', d: smoothPath(M30, true) }),
    svgEl('circle', { class: 'plan__sol', cx: sx, cy: sy, r: 3.5 }),
    label('Sol', SOL[0], SOL[1], { dx: -8, dy: -8, 'text-anchor': 'end' }),
    label('M-30', 40.468, -3.69, { 'text-anchor': 'middle' }),
    label('Río Manzanares', 40.348, -3.668, { class: 'plan__label plan__label--water', transform: `rotate(42 ${project(40.348, -3.668).join(' ')})`, dy: -7 }),
    label('Casa de Campo', 40.42, -3.762, { 'text-anchor': 'middle' }),
    // Trayectos en orden cronológico: se dibujan al entrar en pantalla
    places.slice(1).map((p, i) =>
      svgEl('path', { class: 'plan__hop', d: hop(places[i], p, i % 2 ? -0.22 : 0.22), pathLength: 1, style: `--i:${i}`, 'data-hop': i }),
    ),
    svgEl('circle', { class: 'plan__packet', r: 5, 'data-route-packet': '' }),
  );

  const pins = places.map((p) => {
    const [x, y] = project(p.lugar.lat, p.lugar.lng);
    const side = x > W * 0.62 ? 'left' : 'right';
    return h(
      'button',
      {
        class: `pin pin--${side}`,
        type: 'button',
        style: { '--x': `${((x / W) * 100).toFixed(2)}%`, '--y': `${((y / H) * 100).toFixed(2)}%`, '--i': p.n - 1 },
        'data-pin': p.id,
        'aria-label': `${p.nombre}, ${p.lugar.zona || p.lugar.direccion}. Ver en Google Maps`,
      },
      h('span', { class: 'pin__dot' }, iconNode(p.icono)),
      h('span', { class: 'pin__label', 'aria-hidden': 'true' }, h('strong', {}, p.nombre), p.lugar.zona ? h('span', {}, p.lugar.zona) : null),
    );
  });

  return h(
    'div',
    { class: 'plan', 'data-plan': '' },
    svg,
    pins,
    h(
      'p',
      { class: 'plan__note' },
      h('span', { class: 'plan__compass', 'aria-hidden': 'true' }, 'N'),
      'Plano esquemático de Madrid. Pulsa un punto para abrir el mapa real.',
    ),
  );
}

function period(p) {
  const from = formatDate(p.inicio);
  const to = formatDate(p.fin);
  return [from, to].filter(Boolean).join(' – ');
}

function placeCard(p) {
  const links = mapsLinks(p);
  return h(
    'li',
    { class: 'place', 'data-place': p.id, 'data-reveal': '', style: { '--reveal-delay': `${(p.n - 1) * 90}ms` } },
    h('span', { class: 'place__n', 'aria-hidden': 'true' }, p.n),
    h(
      'div',
      { class: 'place__body' },
      h('p', { class: 'place__when' }, period(p), h('span', { class: 'place__kind' }, p.tipo === 'trabajo' ? 'Trabajo' : 'Estudios')),
      h('h3', { class: 'place__name' }, p.nombre),
      h('p', { class: 'place__what' }, p.detalle),
      h('p', { class: 'place__addr' }, iconNode('map-pin'), h('span', {}, p.lugar.direccion)),
      h(
        'div',
        { class: 'place__actions' },
        h('button', { class: 'btn btn--small', type: 'button', 'data-place-map': p.id }, iconNode('map-pin'), 'Ver en el mapa'),
        h('a', { class: 'place__link', href: links.ruta, target: '_blank', rel: 'noopener noreferrer' }, 'Cómo llegar', iconNode('arrow-up-right')),
      ),
    ),
  );
}

export function renderPlaces(data, c) {
  const places = collectPlaces(data, c);
  if (!places.length) return null;

  const names = places.map((p) => `${p.nombre} (${p.lugar.zona || 'Madrid'})`).join(', ');
  return section(
    { id: 'recorrido', labelledBy: 'route-title', className: 'route-section' },
    sectionHead({
      title: 'Recorrido',
      id: 'route-title',
      lead: 'Los sitios de Madrid donde he estudiado y trabajado, en el orden en que pasé por ellos.',
    }),
    h(
      'div',
      { class: 'route', 'data-route': '' },
      h('ol', { class: 'route__list', role: 'list' }, places.map(placeCard)),
      h(
        'div',
        { class: 'route__stage', 'data-reveal': '' },
        h('div', { class: 'route__plan', role: 'group', 'aria-label': `Plano con mis sitios: ${names}` }, plan(places)),
        // El mapa de Google se inserta aquí cuando el visitante lo pide (ver js/ui/places.js)
        h('div', { class: 'route__embed', hidden: true, 'data-route-embed': '' }),
      ),
    ),
  );
}
