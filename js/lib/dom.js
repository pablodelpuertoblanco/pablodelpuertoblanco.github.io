/* Utilidades de DOM.
   Todo el contenido de data/portfolio.js se inserta como texto (nunca como HTML),
   así que un dato mal escrito no puede inyectar código en la página. */

import { icon } from './icons.js';

/**
 * Crea un elemento. Uso: h('a', { class: 'btn', href: '#' }, 'Texto', otroNodo)
 * - Atributos con valor null/undefined/false se omiten.
 * - on: { click: fn } añade listeners.
 * - Los hijos string se insertan como texto; null/false se ignoran; los arrays se aplanan.
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'on') {
      for (const [evt, fn] of Object.entries(value)) el.addEventListener(evt, fn);
    } else if (key === 'style' && typeof value === 'object') {
      for (const [prop, v] of Object.entries(value)) el.style.setProperty(prop, v);
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else {
      el.setAttribute(key, value === true ? '' : String(value));
    }
  }
  append(el, children);
  return el;
}

export function append(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false || child === '') continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return parent;
}

/** Nodo SVG de un icono del catálogo; si no existe, devuelve un monograma. */
export function iconNode(name, fallbackLabel = '') {
  const svg = icon(name);
  if (svg) {
    const tpl = document.createElement('template');
    tpl.innerHTML = svg; // SVG de confianza, generado en js/lib/icons.js
    return tpl.content.firstElementChild;
  }
  return monogram(fallbackLabel);
}

/** Iniciales para tecnologías sin icono (p. ej. "Divi" → "Di"). */
export function monogram(label = '') {
  const clean = String(label).replace(/^EDITAR:?\s*/i, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  let text = '';
  if (words.length > 1) text = words[0][0] + words[1][0];
  else text = clean.slice(0, 2);
  return h('span', { class: 'monogram', 'aria-hidden': 'true' }, text || '•');
}

/** Texto largo (correo, URL) con puntos de corte suaves antes de "@" y tras "/". */
export function breakable(text = '') {
  const parts = String(text).split(/(?=@)|(?<=\/)/);
  return parts.flatMap((p, i) => (i ? [document.createElement('wbr'), p] : [p]));
}

/** Solo permite enlaces http(s), mailto, tel y rutas relativas. */
export function safeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const value = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null; // javascript:, data:, etc.
  return value; // ruta relativa o ancla
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Elemento SVG con atributos (para los gráficos dibujados a mano). */
export function svgEl(tag, attrs = {}, ...children) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    el.setAttribute(k, v);
  }
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}
