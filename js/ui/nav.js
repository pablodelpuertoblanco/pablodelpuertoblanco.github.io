/* Navegación: cabecera al hacer scroll, menú móvil y sección activa. */

import { $, $$ } from '../lib/dom.js';

export function initNav() {
  const header = $('.site-header');
  const nav = $('#site-nav');
  const toggle = $('.nav-toggle');
  const links = $$('.site-nav__link');

  // Cabecera con fondo cuando la página ya no está arriba del todo
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  const setOpen = (open) => {
    nav?.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle?.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (toggle?.getAttribute('aria-expanded') !== 'true') return;
    const path = e.composedPath();
    if (!path.includes(nav) && !path.includes(toggle)) setOpen(false);
  });
  window.matchMedia('(min-width: 62.01rem)').addEventListener('change', (e) => e.matches && setOpen(false));

  // Sección activa: el enlace correspondiente enciende su LED
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const targets = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!('IntersectionObserver' in window) || !targets.length) return;

  const visible = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      let best = null;
      let bestRatio = 0;
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) {
          best = id;
          bestRatio = ratio;
        }
      }
      links.forEach((a) => a.removeAttribute('aria-current'));
      if (best) byId.get(best)?.setAttribute('aria-current', 'true');
    },
    { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] },
  );
  targets.forEach((t) => io.observe(t));
}
