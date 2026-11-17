/* Botones "copiar" (p. ej. el correo en la sección de contacto). */

import { $$, iconNode } from '../lib/dom.js';

export function initCopyButtons() {
  $$('[data-copy]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const original = btn.getAttribute('aria-label');
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.replaceChildren(iconNode('circle-check'));
        btn.setAttribute('aria-label', 'Copiado');
        btn.title = 'Copiado';
      } catch {
        btn.title = 'No se ha podido copiar';
      }
      setTimeout(() => {
        btn.replaceChildren(iconNode('copy'));
        btn.setAttribute('aria-label', original);
        btn.title = 'Copiar';
      }, 1800);
    }),
  );
}
