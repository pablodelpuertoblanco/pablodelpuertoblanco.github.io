import { h, iconNode, safeUrl } from '../lib/dom.js';
import { section, sectionHead, tagList } from './common.js';
import { projectDemo } from './visuals.js';

const CATEGORY_ICONS = {
  'apps móviles': 'smartphone',
  web: 'globe',
  datos: 'chart-column',
  sistemas: 'server',
  redes: 'network',
};

export function categoryIcon(cat = '') {
  return CATEGORY_ICONS[cat.toLowerCase()] || 'code';
}

/** Portada: demo animada si el proyecto la tiene; si no, la captura; si no, la inicial. */
export function projectCover(p, c, { eager = false, demo = false } = {}) {
  if (demo) {
    const animated = projectDemo(p);
    if (animated) return animated;
  }
  const src = c.has(p.imagen) && !c.isPh(p.imagen) ? safeUrl(p.imagen) : null;
  if (src) {
    return h('img', {
      src,
      alt: `Captura de ${c.plain(p.nombre)}`,
      loading: eager ? 'eager' : 'lazy',
      decoding: 'async',
      width: 1280,
      height: 720,
    });
  }
  const name = c.plain(p.nombre).trim();
  return h(
    'div',
    { class: 'cover-gen', 'aria-hidden': 'true' },
    h('span', { class: 'cover-gen__letter' }, c.isPh(p.nombre) ? '?' : name.charAt(0)),
    h('span', { class: 'cover-gen__icon' }, iconNode(categoryIcon(p.categorias?.[0]))),
  );
}

/** Plataforma del repositorio a partir de la URL (GitHub por defecto). */
function codeHost(url) {
  return /gitlab\./i.test(url) ? { label: 'GitLab', icon: 'gitlab' } : { label: 'GitHub', icon: 'github' };
}

/** Botones de código (GitHub/GitLab) y demo (solo si hay URL real). */
export function projectLinks(p, c, { asButtons = false } = {}) {
  const out = [];
  const gh = c.has(p.github) && !c.isPh(p.github) ? safeUrl(p.github) : null;
  const demo = c.has(p.demo) && !c.isPh(p.demo) ? safeUrl(p.demo) : null;
  const name = c.plain(p.nombre);
  if (gh) {
    const host = codeHost(gh);
    out.push(
      asButtons
        ? h('a', { class: 'btn', href: gh, target: '_blank', rel: 'noopener noreferrer' }, iconNode(host.icon), `Código en ${host.label}`)
        : h('a', { class: 'icon-btn', href: gh, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Código de ${name} en ${host.label}`, title: host.label }, iconNode(host.icon)),
    );
  }
  if (demo) {
    out.push(
      asButtons
        ? h('a', { class: 'btn btn--primary', href: demo, target: '_blank', rel: 'noopener noreferrer' }, iconNode('external-link'), 'Abrir demo')
        : h('a', { class: 'icon-btn', href: demo, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Demo de ${name}`, title: 'Demo' }, iconNode('external-link')),
    );
  }
  return out;
}

function card(p, c, animated) {
  const ph = c.isPh(p.nombre);
  const cats = (p.categorias || []).filter(Boolean);
  return h(
    'li',
    { class: 'project', 'data-categories': JSON.stringify(cats), 'data-reveal': '' },
    h(
      'article',
      { class: `project__card ${ph ? 'is-placeholder' : ''}`.trim(), 'aria-labelledby': `p-${p.id}` },
      h('div', { class: 'project__cover' }, projectCover(p, c, { demo: animated })),
      h(
        'div',
        { class: 'project__body' },
        h(
          'p',
          { class: 'project__meta' },
          c.has(p.estado)
            ? h('span', { class: 'project__status' }, h('span', { class: 'led', 'aria-hidden': 'true' }), c.text(p.estado))
            : null,
          cats.length ? h('span', {}, cats.join(', ')) : null,
        ),
        h(
          'h3',
          { class: 'project__title', id: `p-${p.id}` },
          h('button', { class: 'project__open', type: 'button', 'data-project': p.id, 'aria-haspopup': 'dialog' }, c.text(p.nombre)),
        ),
        c.has(p.resumen) ? h('p', { class: 'project__summary' }, c.text(p.resumen)) : null,
        c.has(p.nota) ? h('p', { class: 'project__note' }, c.text(p.nota)) : null,
        tagList((p.tecnologias || []).slice(0, 5), c),
        h(
          'div',
          { class: 'project__footer' },
          h('span', { class: 'project__more', 'aria-hidden': 'true' }, 'Ver detalles', iconNode('chevron-right')),
          h('div', { class: 'project__links' }, projectLinks(p, c)),
        ),
      ),
    ),
  );
}

export function renderProjects(data, c) {
  const projects = c.list(data.proyectos, 'nombre');
  if (!projects.length) return null;

  // Filtros: una categoría por cada valor distinto, con su recuento
  const counts = new Map();
  for (const p of projects) for (const cat of p.categorias || []) counts.set(cat, (counts.get(cat) || 0) + 1);
  const filters =
    counts.size > 1
      ? h(
          'div',
          { class: 'filters', role: 'group', 'aria-label': 'Filtrar proyectos por categoría', 'data-reveal': '' },
          h('button', { class: 'filter', type: 'button', 'aria-pressed': 'true', 'data-filter': '*' }, 'Todos', h('span', { class: 'filter__count' }, projects.length)),
          [...counts].map(([cat, n]) =>
            h('button', { class: 'filter', type: 'button', 'aria-pressed': 'false', 'data-filter': cat }, cat, h('span', { class: 'filter__count' }, n)),
          ),
        )
      : null;

  return section(
    { id: 'proyectos', labelledBy: 'projects-title', className: 'projects-section' },
    sectionHead({
      title: 'Proyectos',
      id: 'projects-title',
      lead: 'Aplicaciones que he desarrollado. Abre cualquiera para ver los detalles.',
    }),
    filters,
    h('ul', { class: 'projects', role: 'list', 'aria-live': 'polite' }, projects.map((p) => card(p, c, data.ajustes?.animaciones !== false))),
  );
}

/** Contenido del diálogo de detalle. */
export function projectDetail(p, c) {
  const features = c.list(p.funcionalidades);
  const links = projectLinks(p, c, { asButtons: true });
  const hasImage = c.has(p.imagen) && !c.isPh(p.imagen);
  return h(
    'div',
    { class: 'project-detail' },
    // En el detalle solo se muestra la portada si hay una captura real
    hasImage ? h('div', { class: 'project-detail__cover' }, projectCover(p, c, { eager: true })) : null,
    h(
      'div',
      { class: 'project-detail__content' },
      h(
        'p',
        { class: 'project__meta' },
        c.has(p.estado)
          ? h('span', { class: 'project__status' }, h('span', { class: 'led', 'aria-hidden': 'true' }), c.text(p.estado))
          : null,
        (p.categorias || []).length ? h('span', {}, p.categorias.join(', ')) : null,
      ),
      c.has(p.descripcion) ? h('p', {}, c.text(p.descripcion)) : c.has(p.resumen) ? h('p', {}, c.text(p.resumen)) : null,
      c.has(p.rol) ? h('div', {}, h('h4', {}, 'Mi papel'), h('p', {}, c.text(p.rol))) : null,
      features.length
        ? h('div', {}, h('h4', {}, 'Funcionalidades principales'), h('ul', { class: 'project-detail__list' }, features.map((f) => h('li', {}, c.text(f)))))
        : null,
      c.list(p.tecnologias).length ? h('div', {}, h('h4', {}, 'Tecnologías'), tagList(p.tecnologias, c)) : null,
      c.has(p.nota) ? h('p', { class: 'project__note' }, c.text(p.nota)) : null,
      links.length ? h('div', { class: 'project-detail__actions' }, links) : null,
    ),
  );
}
