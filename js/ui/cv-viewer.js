/* Visor del CV dentro de la página. En móviles (donde los navegadores no
   muestran bien un PDF incrustado) se deja el comportamiento por defecto:
   abrir el PDF en una pestaña nueva. */

import { $$, h, iconNode } from '../lib/dom.js';
import { openDialog } from './dialog.js';

const canEmbed = () => window.matchMedia('(min-width: 48rem) and (pointer: fine)').matches;

export function initCVViewer(cv) {
  $$('[data-cv-view]').forEach((link) =>
    link.addEventListener('click', (e) => {
      if (!canEmbed()) return; // pestaña nueva
      e.preventDefault();
      const href = link.getAttribute('href');
      const frame = h('iframe', { class: 'dialog__frame', src: href, title: 'Vista previa del currículum (PDF)' });
      const footer = h(
        'div',
        { class: 'dialog__bar' },
        h('span', { class: 'form-note' }, 'Si no ves el documento, ábrelo en una pestaña nueva.'),
        h(
          'div',
          { class: 'cv__actions', style: { 'margin-top': '0' } },
          h('a', { class: 'btn btn--small', href, target: '_blank', rel: 'noopener' }, iconNode('external-link'), 'Abrir en pestaña'),
          h('a', { class: 'btn btn--primary btn--small', href, download: cv?.nombreDescarga || true }, iconNode('download'), 'Descargar'),
        ),
      );
      const content = document.createDocumentFragment();
      content.append(frame, footer);
      openDialog({ title: 'Currículum', content, wide: true });
    }),
  );
}
