/* Topología del hero.

   1. Paquetes ámbar viajan solos por los enlaces, como en el modo simulación
      de Cisco Packet Tracer.
   2. Clic (o toque) sobre el diagrama = ping: una ráfaga de paquetes sale
      de la foto hacia todas las áreas.

   Todo se pausa si el hero no está en pantalla o la pestaña está oculta,
   y no se activa con "reducir movimiento". */

import { prefersReducedMotion } from '../lib/dom.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CORE = { x: 50, y: 50 };
const TRAVEL_MS = 1500;
const MAX_AMBIENT = 4;

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function initTopology() {
  const root = document.querySelector('[data-topology]');
  if (!root || prefersReducedMotion()) return;

  const area = root.closest('.hero__visual') || root;
  const svg = root.querySelector('.topology__links');
  const layer = root.querySelector('.topology__packets');
  const core = root.querySelector('.topology__core');
  const nodeEls = [...root.querySelectorAll('.topology__node')];
  const nodePts = nodeEls.map((el) => ({
    x: parseFloat(el.style.getPropertyValue('--x')),
    y: parseFloat(el.style.getPropertyValue('--y')),
  }));
  const pointFor = (id) => (id === 'core' ? CORE : nodePts[Number(id)]);
  const links = [...root.querySelectorAll('.topology__link')].map((el) => ({
    from: el.dataset.from,
    to: el.dataset.to,
    star: el.dataset.from === 'core',
  }));
  if (!links.length) return;

  /* ---------- Paquetes ---------- */
  const packets = [];
  let lastAmbient = 0;
  let ambientOn = false;

  const spawn = (from, to, { duration = TRAVEL_MS, onArrive, kind = 'ambient' } = {}) => {
    const el = svgEl('circle', { r: '1.15', class: `topology__packet is-${kind}` });
    layer.append(el);
    packets.push({ el, from, to, duration, onArrive, kind, start: performance.now() });
    ensureRunning();
  };

  const hit = (index) => {
    const node = nodeEls[Number(index)];
    if (!node) return;
    node.classList.add('is-hit');
    setTimeout(() => node.classList.remove('is-hit'), 450);
  };

  const pulseCore = () => {
    core.classList.remove('is-pulse');
    void core.offsetWidth; // reinicia la animación
    core.classList.add('is-pulse');
  };

  const spawnAmbient = () => {
    const pool = Math.random() < 0.75 ? links.filter((l) => l.star) : links.filter((l) => !l.star);
    const link = (pool.length ? pool : links)[Math.floor(Math.random() * (pool.length || links.length))];
    const reverse = Math.random() < 0.5;
    const fromId = reverse ? link.to : link.from;
    const toId = reverse ? link.from : link.to;
    spawn(pointFor(fromId), pointFor(toId), { onArrive: () => toId !== 'core' && hit(toId) });
  };

  const ping = (origin = CORE) => {
    pulseCore();
    nodePts.forEach((n, i) =>
      setTimeout(() => spawn(origin, n, { duration: 700, kind: 'ping', onArrive: () => hit(i) }), i * 40),
    );
  };

  /* ---------- Bucle de animación ---------- */
  let running = false;
  let raf = 0;
  let onScreen = true;

  const frame = (now) => {
    if (!running) return;

    const ambientCount = packets.filter((p) => p.kind === 'ambient').length;
    if (ambientOn && ambientCount < MAX_AMBIENT && now - lastAmbient > 520) {
      spawnAmbient();
      lastAmbient = now;
    }

    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      const t = Math.min(1, (now - p.start) / p.duration);
      const a = p.from;
      const b = p.to;
      const e = ease(t);
      p.el.setAttribute('cx', (a.x + (b.x - a.x) * e).toFixed(2));
      p.el.setAttribute('cy', (a.y + (b.y - a.y) * e).toFixed(2));
      p.el.style.opacity = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
      if (t >= 1) {
        p.onArrive?.();
        p.el.remove();
        packets.splice(i, 1);
      }
    }

    // Nada que animar: paramos el bucle hasta la próxima interacción
    if (!ambientOn && !packets.length) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  function ensureRunning() {
    if (running || !onScreen || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  /* ---------- Interacción ---------- */
  area.addEventListener('pointerdown', () => ping(CORE));

  /* ---------- Arranque y pausas ---------- */
  setTimeout(() => {
    ambientOn = true;
    ensureRunning();
  }, 1500); // después de la entrada del hero

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : ensureRunning()));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      onScreen ? ensureRunning() : stop();
    }).observe(root);
  }
}
