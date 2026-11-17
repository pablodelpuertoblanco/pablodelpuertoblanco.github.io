/* Diálogo modal reutilizable basado en <dialog> nativo:
   gestiona el foco, Escape y el clic fuera del contenido. */

import { h, iconNode } from '../lib/dom.js';

let dialog;
let titleEl;
let bodyEl;
let lastFocus = null;

function ensure() {
  if (dialog) return;
  titleEl = h('h2', { class: 'dialog__title', id: 'dialog-title' });
  bodyEl = h('div', { class: 'dialog__body' });
  dialog = h(
    'dialog',
    { class: 'dialog', 'aria-labelledby': 'dialog-title' },
    h(
      'div',
      { class: 'dialog__bar' },
      titleEl,
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Cerrar', 'data-close': '' }, iconNode('close')),
    ),
    bodyEl,
  );
  document.body.append(dialog);

  dialog.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) dialog.close();
    // Clic en el fondo (fuera de la caja del diálogo)
    const r = dialog.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (e.target === dialog && outside) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    bodyEl.replaceChildren();
    lastFocus?.focus?.();
  });
}

/**
 * Abre el diálogo.
 * @param {{ title: string|Node, content: Node, wide?: boolean }} options
 */
export function openDialog({ title, content, wide = false }) {
  ensure();
  lastFocus = document.activeElement;
  titleEl.replaceChildren(title);
  bodyEl.replaceChildren(content);
  dialog.classList.toggle('dialog--wide', wide);
  bodyEl.style.display = wide ? 'contents' : '';
  document.documentElement.style.overflow = 'hidden';
  dialog.showModal();
  bodyEl.scrollTop = 0;
}
