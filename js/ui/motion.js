/* Movimiento al hacer scroll: revelado suave y línea de los timelines. */

import { $$, prefersReducedMotion } from '../lib/dom.js';

/** Muestra con un leve desplazamiento los bloques marcados con data-reveal. */
export function initReveal() {
  const items = $$('[data-reveal]');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    document.documentElement.classList.remove('has-motion');
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}

/** La línea ámbar del timeline avanza con el scroll y enciende cada punto al pasar. */
export function initTimelines() {
  const lines = $$('[data-timeline]');
  if (!lines.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const anchor = window.innerHeight * 0.6;
    for (const tl of lines) {
      const rect = tl.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      tl.style.setProperty('--progress', progress.toFixed(3));
      for (const item of tl.children) {
        const dot = item.querySelector('.timeline__dot');
        if (dot) item.classList.toggle('is-lit', dot.getBoundingClientRect().top < anchor);
      }
    }
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
