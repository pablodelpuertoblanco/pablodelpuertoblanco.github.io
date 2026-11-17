/* Efectos visuales. Todos son opcionales (ajustes.animaciones) y se desactivan
   solos si el visitante tiene activado "reducir movimiento" en su sistema. */

import { $, $$, h, prefersReducedMotion } from '../lib/dom.js';

const canObserve = 'IntersectionObserver' in window;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Marca con .in-view lo que está en pantalla, para pausar el resto y ahorrar batería. */
function initInView() {
  const items = $$('[data-inview]');
  if (!canObserve) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)), { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
}

/** Barra superior: cuánto de la página se ha "transferido". */
function initScrollProgress() {
  const bar = h('div', { class: 'scroll-progress', 'aria-hidden': 'true' }, h('span', { class: 'scroll-progress__fill' }));
  document.body.append(bar);
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

/** Guía lateral: un LED por sección, encendido en la que estás (solo ratón, pantallas anchas). */
function initRail() {
  const sections = $$('main > section[id]');
  if (sections.length < 3 || !canObserve) return;
  const labelOf = (s) => (s.id === 'inicio' ? 'Inicio' : $('h2', s)?.getAttribute('aria-label') || $('h2', s)?.textContent || s.id);
  const links = sections.map((s) =>
    h('a', { class: 'rail__link', href: `#${s.id}`, tabindex: '-1', 'data-rail': s.id }, h('span', { class: 'rail__label' }, labelOf(s)), h('span', { class: 'rail__led' })),
  );
  // Duplica la navegación principal, así que se oculta a teclado y lectores de pantalla
  document.body.append(h('nav', { class: 'rail', 'aria-hidden': 'true' }, links));

  const visible = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRect.height : 0);
      let best = null;
      let max = 0;
      for (const [id, height] of visible) if (height > max) [best, max] = [id, height];
      links.forEach((a) => a.classList.toggle('is-active', a.dataset.rail === best));
    },
    { threshold: [0, 0.15, 0.4, 0.7, 1] },
  );
  sections.forEach((s) => io.observe(s));
}

/** El rol del hero se borra y se reescribe con las distintas facetas del perfil. */
function initTyper() {
  const el = $('[data-typer]');
  if (!el) return;
  const roles = JSON.parse(el.dataset.typer || '[]');
  const out = $('.typer__text', el);
  if (roles.length < 2 || !out) return;

  let index = 0;
  let timer = 0;
  const wait = (ms) => new Promise((resolve) => (timer = setTimeout(resolve, ms)));
  const run = async () => {
    await wait(3200);
    for (;;) {
      const current = roles[index];
      el.classList.add('is-typing');
      for (let i = current.length; i >= 0; i--) {
        out.textContent = current.slice(0, i);
        await wait(22);
      }
      index = (index + 1) % roles.length;
      const next = roles[index];
      await wait(260);
      for (let i = 1; i <= next.length; i++) {
        out.textContent = next.slice(0, i);
        await wait(46 + Math.random() * 40);
      }
      el.classList.remove('is-typing');
      await wait(index === 0 ? 4200 : 2400);
    }
  };
  // Espera a que acabe la intro para no competir con ella
  const start = () => (document.documentElement.classList.contains('intro-playing') ? setTimeout(start, 400) : run());
  start();
  document.addEventListener('visibilitychange', () => document.hidden && clearTimeout(timer), { once: true });
}

/** Títulos de sección: las letras suben una a una al entrar en pantalla. */
function initTitles() {
  for (const title of $$('.section-head__title')) {
    const text = title.textContent.trim();
    if (!text || title.children.length) continue;
    title.setAttribute('aria-label', text);
    let n = 0;
    const words = text.split(/\s+/).map((word) =>
      h('span', { class: 'title-word', 'aria-hidden': 'true' }, [...word].map((ch) => h('span', { class: 'title-char', style: { '--c': n++ } }, ch))),
    );
    title.replaceChildren(...words.flatMap((w, i) => (i ? [' ', w] : [w])));
    title.classList.add('is-split');
  }
}

/** Panel de habilidades: los LED se encienden en cascada y luego parpadean como tráfico real. */
function initPanel() {
  const panel = $('.panel');
  if (!panel) return;
  const ports = $$('.port', panel);
  ports.forEach((port, i) => port.style.setProperty('--i', i));
  panel.classList.add('panel--boot');
  panel.dataset.inview = '';

  let timer = 0;
  const blink = () => {
    if (panel.classList.contains('in-view') && panel.classList.contains('is-visible')) {
      const port = ports[Math.floor(Math.random() * ports.length)];
      port.classList.add('is-busy');
      setTimeout(() => port.classList.remove('is-busy'), 520);
    }
    timer = setTimeout(blink, 260 + Math.random() * 520);
  };
  timer = setTimeout(blink, 2400);
  return () => clearTimeout(timer);
}

/** Panel de datos: las barras y el anillo cambian cada poco, como un informe en vivo. */
function initDash() {
  for (const dash of $$('[data-dash]')) {
    const bars = $$('.dash__bars i', dash);
    const donut = $('.dash__donut-fg', dash);
    const tick = () => {
      if (!dash.classList.contains('in-view')) return;
      bars.forEach((bar) => bar.style.setProperty('--h', `${Math.round(28 + Math.random() * 68)}%`));
      donut?.style.setProperty('--p', String(Math.round(35 + Math.random() * 50)));
    };
    setInterval(tick, 2600);
  }
}

/** Terminal: escribe los comandos al entrar en pantalla (una sola vez). */
function initTerminal() {
  const term = $('[data-terminal]');
  if (!term || !canObserve) return;
  const lines = $$('.term__line', term);
  const body = $('.term__body', term);
  // Reserva la altura final para que el texto de alrededor no salte mientras se escribe
  body.style.minHeight = `${body.offsetHeight}px`;
  lines.forEach((line) => (line.hidden = true));
  const commands = new Map($$('[data-cmd]', term).map((el) => [el, el.textContent]));
  commands.forEach((_, el) => (el.textContent = ''));

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const play = async () => {
    for (const line of lines) {
      line.hidden = false;
      const cmd = $('[data-cmd]', line);
      if (cmd) {
        const text = commands.get(cmd);
        cmd.classList.add('is-typing');
        await wait(280);
        for (let i = 1; i <= text.length; i++) {
          cmd.textContent = text.slice(0, i);
          await wait(34 + Math.random() * 36);
        }
        cmd.classList.remove('is-typing');
        await wait(240);
      } else if (!line.hasAttribute('data-last')) {
        await wait(90);
      }
    }
  };
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      play();
    },
    { threshold: 0.45 },
  );
  io.observe(term);
}

/** Foco de luz que sigue al cursor sobre tarjetas, y leve inclinación en los proyectos. */
function initPointerEffects() {
  if (!finePointer()) return;
  const glow = $$('.project__card, .place');
  for (const el of glow) {
    el.classList.add('glow');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }
  for (const card of $$('.project__card')) {
    card.classList.add('tilt');
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-y * 4).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  }
}

export function initEffects(ajustes = {}) {
  const root = document.documentElement;
  initScrollProgress();
  if (ajustes.animaciones === false || prefersReducedMotion()) {
    // Sin animaciones: todo lo ilustrativo se muestra ya en su estado final
    $$('[data-inview]').forEach((el) => el.classList.add('in-view', 'is-static'));
    return;
  }
  root.classList.add('fx');
  initTitles();
  initPanel();
  initInView();
  initRail();
  initTyper();
  initDash();
  initTerminal();
  initPointerEffects();
}
