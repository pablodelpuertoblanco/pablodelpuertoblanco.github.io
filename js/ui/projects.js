/* Proyectos: filtros por categoría y detalle en un diálogo. */

import { $$ } from '../lib/dom.js';
import { projectDetail } from '../render/projects.js';
import { openDialog } from './dialog.js';

export function initProjects(data, c) {
  const filters = $$('.filter');
  const cards = $$('.project');

  filters.forEach((btn) =>
    btn.addEventListener('click', () => {
      const value = btn.dataset.filter;
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      for (const card of cards) {
        const cats = JSON.parse(card.dataset.categories || '[]');
        card.hidden = value !== '*' && !cats.includes(value);
      }
    }),
  );

  const byId = new Map((data.proyectos || []).map((p) => [p.id, p]));
  $$('[data-project]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const project = byId.get(btn.dataset.project);
      if (!project) return;
      openDialog({ title: c.text(project.nombre), content: projectDetail(project, c) });
    }),
  );
}
