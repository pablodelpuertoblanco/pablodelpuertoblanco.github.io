/* Contenido: marcas EDITAR, fechas y textos derivados de los datos. */

import { h } from './dom.js';

const PH_RE = /^\s*(EDITAR|PLACEHOLDER)\b:?\s*/i;

/** ¿Es un texto provisional ("EDITAR: …")? */
export function isPh(value) {
  return typeof value === 'string' && PH_RE.test(value);
}

/**
 * Crea las funciones de contenido según el ajuste mostrarPlaceholders.
 *  - has(v): ¿hay algo que mostrar? (vacío → no; EDITAR con el ajuste en false → no)
 *  - text(v): nodo de texto, o marca EDITAR visible si es provisional
 *  - list(arr, key): filtra elementos cuyo campo principal sea EDITAR cuando se ocultan
 */
export function createContent({ mostrarPlaceholders = true } = {}) {
  const show = Boolean(mostrarPlaceholders);

  const has = (value) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.some(has);
    if (typeof value === 'string') return value.trim() !== '' && (show || !isPh(value));
    return true;
  };

  const text = (value) => {
    if (!has(value)) return null;
    if (!isPh(value)) return String(value);
    return h(
      'span',
      { class: 'ph', title: 'Texto provisional: edítalo en data/portfolio.js' },
      h('span', { class: 'ph-badge' }, 'EDITAR'),
      value.replace(PH_RE, ''),
    );
  };

  const list = (arr = [], key) =>
    (arr || []).filter((item) => (key ? has(item?.[key]) : has(item)));

  /** Texto plano (sin marca) para atributos como alt o aria-label. */
  const plain = (value) => (typeof value === 'string' ? value.replace(PH_RE, '') : '');

  return { show, has, text, list, plain, isPh };
}

/* ---------- Fechas ---------- */
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];

function parseDate(value) {
  if (!value || value === 'actualidad') return null;
  const [y, m] = String(value).split('-').map(Number);
  return { y, m: m || null };
}

/** '2025-01' → 'ene 2025'; '2025' → '2025'; 'actualidad' → 'Actualidad' */
export function formatDate(value) {
  if (!value) return '';
  if (value === 'actualidad') return 'Actualidad';
  const d = parseDate(value);
  if (!d || Number.isNaN(d.y)) return String(value);
  return d.m ? `${MONTHS[d.m - 1]} ${d.y}` : String(d.y);
}

/** Duración legible entre dos fechas AAAA-MM (incluye ambos meses). */
export function duration(start, end) {
  const a = parseDate(start);
  if (!a || !a.m) return '';
  const now = new Date();
  const b = parseDate(end) || { y: now.getFullYear(), m: now.getMonth() + 1 };
  if (!b.m) return '';
  const total = (b.y - a.y) * 12 + (b.m - a.m) + 1;
  if (total <= 0) return '';
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  if (months) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
  return parts.join(' y ');
}

/** Valor para el atributo datetime de <time>. */
export function isoDate(value) {
  if (!value || value === 'actualidad') return null;
  return String(value);
}
