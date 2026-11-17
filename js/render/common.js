/* Piezas compartidas entre secciones. */

import { h, iconNode, safeUrl } from '../lib/dom.js';

/** Secciones de la navegación (el id coincide con el de cada <section>). */
export const NAV = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'formacion', label: 'Formación' },
  { id: 'contacto', label: 'Contacto' },
];

export function fullName(perfil) {
  return [perfil.nombre, perfil.apellidos].filter(Boolean).join(' ');
}

/** Cabecera de sección: título y frase de apoyo. */
export function sectionHead({ title, lead, id, level = 'h2', className = '' }) {
  return h(
    'header',
    { class: `section-head ${className}`.trim(), 'data-reveal': '' },
    h(level, { class: 'section-head__title', id }, title),
    lead ? h('p', { class: 'section-head__lead' }, lead) : null,
  );
}

/** Contenedor estándar de sección. */
export function section({ id, labelledBy, className = '' }, ...children) {
  return h(
    'section',
    { class: `section ${className}`.trim(), id, 'aria-labelledby': labelledBy },
    h('div', { class: 'container' }, ...children),
  );
}

/** Marca del sitio: un nodo con un paquete ámbar (igual que el favicon). */
export function brandMark(className = 'brand__mark') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML =
    '<rect x="1" y="1" width="62" height="62" rx="14" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
    '<circle cx="30" cy="34" r="13" fill="none" stroke="currentColor" stroke-width="5"/>' +
    '<circle cx="46" cy="17" r="6" fill="var(--amber)"/>';
  return svg;
}

/**
 * Enlaces profesionales a partir de data.enlaces y el email del perfil.
 * Los EDITAR se devuelven como "pendientes" (sin href) para mostrarlos marcados.
 */
export function profileLinks(data, c) {
  const { enlaces = {}, perfil = {} } = data;
  const items = [];
  const add = (key, label, url, iconName) => {
    if (!c.has(url)) return;
    items.push({
      key,
      label,
      icon: iconName,
      pending: c.isPh(url),
      href: c.isPh(url) ? null : safeUrl(url),
      external: /^https?:/i.test(url),
    });
  };
  add('gitlab', 'GitLab', enlaces.gitlab, 'gitlab');
  add('github', 'GitHub', enlaces.github, 'github');
  add('linkedin', 'LinkedIn', enlaces.linkedin, 'linkedin');
  if (c.has(perfil.email)) add('email', 'Correo electrónico', `mailto:${perfil.email}`, 'mail');
  for (const extra of enlaces.otros || []) {
    add(extra.nombre?.toLowerCase() || 'otro', extra.nombre, extra.url, extra.icono || 'globe');
  }
  return items;
}

/** Botón de icono para un enlace profesional (o marca EDITAR si falta la URL). */
export function linkButton(link) {
  if (link.pending) {
    return h(
      'span',
      {
        class: 'icon-btn is-placeholder',
        role: 'img',
        'aria-label': `${link.label}: enlace pendiente de configurar`,
        title: `EDITAR: añade tu enlace de ${link.label} en data/portfolio.js`,
      },
      iconNode(link.icon, link.label),
    );
  }
  return h(
    'a',
    {
      class: 'icon-btn',
      href: link.href,
      'aria-label': link.label,
      title: link.label,
      target: link.external ? '_blank' : null,
      rel: link.external ? 'noopener noreferrer' : null,
    },
    iconNode(link.icon, link.label),
  );
}

/** Lista de etiquetas de tecnología. */
export function tagList(items, c) {
  const visible = c.list(items);
  if (!visible.length) return null;
  return h(
    'ul',
    { class: 'tags', role: 'list' },
    visible.map((t) => h('li', { class: `tag ${c.isPh(t) ? 'is-placeholder' : ''}`.trim() }, c.text(t))),
  );
}
