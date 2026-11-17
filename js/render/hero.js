import { h, iconNode, safeUrl } from '../lib/dom.js';
import { fullName, linkButton, profileLinks } from './common.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/** Topología: tú en el centro, tus áreas alrededor, enlaces en estrella y en anillo. */
function topology(data, c) {
  const { perfil, hero } = data;
  const nodes = (hero?.nodos || []).filter((n) => c.has(n.etiqueta));

  const lines = svg('svg', {
    class: 'topology__links',
    viewBox: '0 0 100 100',
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
  });
  const linksGroup = svg('g');
  const packets = svg('g', { class: 'topology__packets' });

  nodes.forEach((n, i) => {
    linksGroup.append(
      svg('line', {
        class: 'topology__link',
        x1: 50, y1: 50, x2: n.x, y2: n.y,
        'data-from': 'core', 'data-to': i,
      }),
    );
    const next = nodes[(i + 1) % nodes.length];
    if (nodes.length > 2) {
      linksGroup.append(
        svg('line', {
          class: 'topology__link topology__link--mesh',
          x1: n.x, y1: n.y, x2: next.x, y2: next.y,
          'data-from': i, 'data-to': (i + 1) % nodes.length,
        }),
      );
    }
  });
  lines.append(linksGroup, packets);

  const nodeEls = nodes.map((n, i) =>
    h(
      'span',
      {
        class: 'topology__node',
        style: { '--x': `${n.x}%`, '--y': `${n.y}%`, '--i': i },
        'data-node': i,
      },
      h('span', { class: 'topology__node-icon' }, iconNode(n.icono, n.etiqueta)),
      c.plain(n.etiqueta),
    ),
  );

  const labels = nodes.map((n) => c.plain(n.etiqueta)).join(', ');
  return h(
    'div',
    {
      class: 'topology',
      role: 'img',
      'aria-label': `Diagrama: ${fullName(perfil)} conectado a sus áreas de trabajo: ${labels}.`,
      'data-topology': '',
    },
    lines,
    h(
      'div',
      { class: 'topology__core' },
      c.has(perfil.foto?.src)
        ? h('img', {
            class: 'topology__photo',
            src: safeUrl(perfil.foto.src),
            alt: '',
            width: 360,
            height: 360,
            fetchpriority: 'high',
            decoding: 'async',
          })
        : null,
      h('span', { class: 'led topology__core-led led--blink', 'aria-hidden': 'true' }),
    ),
    nodeEls,
  );
}

/** Rol: texto fijo para lectores de pantalla y versión que se escribe sola a la vista. */
function roleNode(data, c) {
  const { perfil, hero = {}, ajustes = {} } = data;
  const roles = [perfil.rol, ...(hero.roles || [])].filter((r, i, all) => c.has(r) && !c.isPh(r) && all.indexOf(r) === i);
  if (ajustes.animaciones === false || roles.length < 2) return c.text(perfil.rol);
  return h(
    'span',
    { class: 'typer', 'data-typer': JSON.stringify(roles) },
    h('span', { class: 'visually-hidden' }, perfil.rol),
    h('span', { class: 'typer__text', 'aria-hidden': 'true' }, perfil.rol),
    h('span', { class: 'typer__caret', 'aria-hidden': 'true' }),
  );
}

export function renderHero(data, c) {
  const { perfil, cv } = data;
  const links = profileLinks(data, c);
  const cvHref = safeUrl(cv?.archivo);
  let i = 0;
  const step = () => ({ '--i': i++ });

  const intro = h(
    'div',
    { class: 'hero__intro' },
    perfil.disponible && c.has(perfil.textoDisponible)
      ? h(
          'p',
          { class: 'hero__status', style: step() },
          h('span', { class: 'led led--blink', 'aria-hidden': 'true' }),
          c.text(perfil.textoDisponible),
        )
      : null,
    h(
      'h1',
      { class: 'hero__name', id: 'hero-title', style: step() },
      h('span', { class: 'hero__name-line' }, perfil.nombre),
      ' ',
      h('span', { class: 'hero__name-line' }, perfil.apellidos),
    ),
    h(
      'p',
      { class: 'hero__role', style: step() },
      roleNode(data, c),
      c.has(perfil.ubicacion)
        ? h('span', { class: 'hero__role-place' }, ` en ${perfil.ubicacion.split(',')[0]}`)
        : null,
    ),
    c.has(perfil.resumen) ? h('p', { class: 'hero__summary', style: step() }, c.text(perfil.resumen)) : null,
    c.has(perfil.filosofia)
      ? h('blockquote', { class: 'hero__motto', style: step() }, h('p', {}, c.text(perfil.filosofia)))
      : null,
    h(
      'div',
      { class: 'hero__actions', style: step() },
      cvHref
        ? h(
            'a',
            {
              class: 'btn btn--primary',
              href: cvHref,
              download: cv.nombreDescarga || true,
              type: 'application/pdf',
            },
            iconNode('download'),
            'Descargar CV',
          )
        : null,
      h('a', { class: 'btn', href: '#proyectos' }, 'Ver proyectos'),
    ),
    links.length
      ? h(
          'ul',
          { class: 'hero__social', role: 'list', 'aria-label': 'Perfiles profesionales', style: step() },
          links.map((l) => h('li', {}, linkButton(l))),
        )
      : null,
  );

  return h(
    'section',
    { class: 'hero', id: 'inicio', 'aria-labelledby': 'hero-title' },
    h(
      'div',
      { class: 'container hero__grid' },
      intro,
      h(
        'div',
        { class: 'hero__visual' },
        topology(data, c),
      ),
    ),
  );
}
