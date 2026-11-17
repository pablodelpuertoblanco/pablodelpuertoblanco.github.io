import { h, iconNode, safeUrl } from '../lib/dom.js';
import { section } from './common.js';

/** Miniatura abstracta del CV: mismo esquema (barra lateral marino, foto, texto). */
function docThumb(perfil) {
  const bars = (n, cls = '') => Array.from({ length: n }, (_, i) => h('span', { class: `cv__doc-bar ${i % 3 === 2 ? 'cv__doc-bar--short' : ''} ${cls}`.trim() }));
  return h(
    'div',
    { class: 'cv__doc', 'aria-hidden': 'true' },
    h('div', { class: 'cv__doc-side' }, h('span', { class: 'cv__doc-photo' }), bars(5, 'cv__doc-bar--light')),
    h(
      'div',
      { class: 'cv__doc-main' },
      h('span', { class: 'cv__doc-name' }, [perfil.nombre, (perfil.apellidos || '').split(' ').slice(0, 2).join(' ')].join(' ')),
      h('span', { class: 'cv__doc-bar cv__doc-bar--dark' }),
      bars(6),
      h('span', { class: 'cv__doc-bar cv__doc-bar--dark' }),
      bars(4),
    ),
  );
}

export function renderCV(data, c) {
  const { cv, perfil } = data;
  const href = safeUrl(cv?.archivo);
  if (!href) return null;
  const meta = [cv.detalle, c.has(cv.actualizado) ? `actualizado en ${cv.actualizado}` : null].filter(Boolean).join(', ');

  return section(
    { id: 'cv', labelledBy: 'cv-title', className: 'cv' },
    h(
      'div',
      { class: 'cv__panel', 'data-reveal': '' },
      docThumb(perfil),
      h(
        'div',
        {},
        h('h2', { class: 'cv__title', id: 'cv-title' }, 'Currículum'),
        h('p', { class: 'cv__text' }, 'Toda mi experiencia y formación en una página. Puedes abrirlo aquí antes de descargarlo.'),
        meta ? h('p', { class: 'cv__meta' }, iconNode('file-text'), meta.charAt(0).toUpperCase() + meta.slice(1)) : null,
        h(
          'div',
          { class: 'cv__actions' },
          h(
            'a',
            { class: 'btn btn--primary', href, download: cv.nombreDescarga || true, type: 'application/pdf' },
            iconNode('download'),
            'Descargar CV',
          ),
          // Sin JavaScript abre el PDF en otra pestaña; con JavaScript, en un visor dentro de la página
          h(
            'a',
            { class: 'btn', href, target: '_blank', rel: 'noopener', 'data-cv-view': '', 'aria-haspopup': 'dialog' },
            iconNode('eye'),
            'Ver CV',
          ),
        ),
      ),
    ),
  );
}
