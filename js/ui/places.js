/* Recorrido: selección de sitios, mapa real de Google Maps y paquete que recorre la ruta. */

import { $, $$, h, iconNode, prefersReducedMotion } from '../lib/dom.js';
import { collectPlaces, mapsLinks } from '../render/places.js';

export function initPlaces(data, c) {
  const root = $('[data-route]');
  if (!root) return;
  const places = collectPlaces(data, c);
  const byId = new Map(places.map((p) => [p.id, p]));
  const planBox = $('.route__plan', root);
  const embed = $('[data-route-embed]', root);
  const cards = $$('[data-place]', root);
  const pins = $$('[data-pin]', root);

  /** Resalta un sitio en la lista y en el plano. */
  const highlight = (id) => {
    cards.forEach((el) => el.classList.toggle('is-active', el.dataset.place === id));
    pins.forEach((el) => el.classList.toggle('is-active', el.dataset.pin === id));
  };

  const closeMap = (focusId) => {
    embed.hidden = true;
    embed.replaceChildren(); // quita el iframe: deja de cargar nada de Google
    planBox.hidden = false;
    if (focusId) $(`[data-pin="${focusId}"]`, root)?.focus();
  };

  /** Sustituye el plano por el mapa real del sitio. */
  const openMap = (id, { focus = true } = {}) => {
    const place = byId.get(id);
    if (!place) return;
    const links = mapsLinks(place);
    highlight(id);
    const back = h('button', { class: 'btn btn--small', type: 'button', on: { click: () => closeMap(id) } }, iconNode('network'), 'Volver al plano');
    embed.replaceChildren(
      h(
        'div',
        { class: 'route__embed-bar' },
        h('p', { class: 'route__embed-title' }, h('strong', {}, place.nombre), h('span', {}, place.lugar.direccion)),
        h(
          'div',
          { class: 'route__embed-actions' },
          back,
          h('a', { class: 'btn btn--small btn--primary', href: links.abrir, target: '_blank', rel: 'noopener noreferrer' }, iconNode('external-link'), 'Abrir en Google Maps'),
        ),
      ),
      h('iframe', {
        class: 'route__map',
        src: links.incrustado,
        title: `Mapa de Google Maps: ${place.nombre}, ${place.lugar.direccion}`,
        loading: 'lazy',
        referrerpolicy: 'no-referrer-when-downgrade',
        allowfullscreen: true,
      }),
    );
    planBox.hidden = true;
    embed.hidden = false;
    if (focus) back.focus({ preventScroll: true });
  };

  pins.forEach((pin) => {
    pin.addEventListener('click', () => openMap(pin.dataset.pin));
    pin.addEventListener('pointerenter', () => highlight(pin.dataset.pin));
    pin.addEventListener('focus', () => highlight(pin.dataset.pin));
  });
  cards.forEach((card) => {
    card.addEventListener('pointerenter', () => highlight(card.dataset.place));
    card.addEventListener('focusin', () => highlight(card.dataset.place));
  });
  $$('[data-place-map]', root).forEach((btn) => btn.addEventListener('click', () => openMap(btn.dataset.placeMap)));

  // Botones de ubicación de los timelines: bajan al recorrido y abren ese sitio
  $$('[data-goto-place]').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (!byId.has(btn.dataset.gotoPlace)) return;
      openMap(btn.dataset.gotoPlace, { focus: false });
      root.closest('section').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      embed.querySelector('button')?.focus({ preventScroll: true });
    }),
  );

  initRoutePacket(root);
}

/** Un paquete ámbar recorre los trayectos en bucle mientras el plano está en pantalla. */
function initRoutePacket(root) {
  const packet = $('[data-route-packet]', root);
  const hops = $$('[data-hop]', root);
  const stage = $('.route__stage', root);
  if (!packet || !hops.length || prefersReducedMotion() || !('IntersectionObserver' in window)) {
    packet?.remove();
    stage.classList.add('is-drawn');
    return;
  }

  const lengths = hops.map((p) => p.getTotalLength());
  const HOP_MS = 1900;
  const PAUSE_MS = 700;
  const cycle = hops.length * (HOP_MS + PAUSE_MS) + 900;
  let raf = 0;
  let start = 0;

  const frame = (now) => {
    if (!start) start = now;
    const t = (now - start) % cycle;
    const slot = Math.floor(t / (HOP_MS + PAUSE_MS));
    const local = t - slot * (HOP_MS + PAUSE_MS);
    if (slot < hops.length && local <= HOP_MS) {
      const k = local / HOP_MS;
      const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const pt = hops[slot].getPointAtLength(eased * lengths[slot]);
      packet.setAttribute('cx', pt.x.toFixed(1));
      packet.setAttribute('cy', pt.y.toFixed(1));
      packet.style.opacity = '1';
    } else {
      packet.style.opacity = '0';
    }
    raf = requestAnimationFrame(frame);
  };

  new IntersectionObserver(
    ([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting && !root.querySelector('.route__plan').hidden) {
        stage.classList.add('is-drawn');
        // Espera a que se dibujen los trayectos antes de lanzar el paquete
        start = 0;
        raf = requestAnimationFrame((now) => {
          start = now + 1500;
          raf = requestAnimationFrame(function wait(n) {
            if (n < start) raf = requestAnimationFrame(wait);
            else {
              start = 0;
              raf = requestAnimationFrame(frame);
            }
          });
        });
      }
    },
    { threshold: 0.3 },
  ).observe(stage);
}
