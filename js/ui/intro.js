/* Intro: un "apretón de manos" TCP entre el visitante y Pablo.
   SYN → SYN-ACK → ACK, "Conexión establecida", y la pantalla se cierra
   en un círculo sobre la foto del hero, donde empieza la web.

   • Dura unos 2,5 s y se salta con un clic, una tecla o la rueda del ratón.
   • Solo se ve una vez por sesión (sessionStorage).
   • No aparece con "reducir movimiento", si se entra por un enlace a una sección
     (#contacto, por ejemplo) o si ajustes.intro es false. */

import { h, prefersReducedMotion, safeUrl } from '../lib/dom.js';

const KEY = 'intro-visto';
const AUTO_REVEAL_MS = 2000;

export function shouldPlayIntro(settings = {}) {
  if (settings.intro === false) return false;
  if (prefersReducedMotion()) return false;
  if (location.hash && location.hash !== '#inicio') return false;
  try {
    if (sessionStorage.getItem(KEY)) return false;
  } catch {
    /* sin sessionStorage: se muestra igualmente */
  }
  return true;
}

function buildOverlay(perfil) {
  const photo = safeUrl(perfil.foto?.src);
  const step = (n, text) => h('span', { class: `intro__step intro__step--${n}` }, text);
  const packet = (n) => h('span', { class: `intro__packet intro__packet--${n}` });

  return h(
    'div',
    { class: 'intro', 'aria-hidden': 'true' },
    h(
      'div',
      { class: 'intro__stage' },
      h(
        'div',
        { class: 'intro__node intro__node--you' },
        h('span', { class: 'intro__you' }),
        h('span', { class: 'intro__label' }, 'Tú'),
      ),
      h(
        'div',
        { class: 'intro__wire' },
        h('span', { class: 'intro__line' }),
        h('span', { class: 'intro__line-lit' }),
        packet(1), packet(2), packet(3),
        step(1, 'SYN'), step(2, 'SYN-ACK'), step(3, 'ACK'),
      ),
      h(
        'div',
        { class: 'intro__node intro__node--me' },
        h(
          'span',
          { class: 'intro__me' },
          photo ? h('img', { src: photo, alt: '', width: 120, height: 120 }) : null,
          h('span', { class: 'led intro__led' }),
        ),
        h('span', { class: 'intro__label' }, perfil.nombre),
      ),
    ),
    h(
      'p',
      { class: 'intro__status' },
      h('span', { class: 'intro__status-a' }, 'Conectando…'),
      h('span', { class: 'intro__status-b' }, 'Conexión establecida'),
    ),
    h('span', { class: 'intro__skip' }, 'Haz clic para saltar'),
  );
}

/** Reproduce la intro. Devuelve una promesa que se resuelve al terminar (o al instante si no toca). */
export function playIntro(data) {
  const root = document.documentElement;
  if (!shouldPlayIntro(data.ajustes)) return Promise.resolve();

  const overlay = buildOverlay(data.perfil);
  document.body.append(overlay);
  root.classList.add('intro-playing');

  return new Promise((resolve) => {
    let revealed = false;
    let timer = 0;

    const finish = () => {
      overlay.remove();
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* sin sessionStorage */
      }
      resolve();
    };

    const reveal = (fast = false) => {
      if (revealed) return;
      revealed = true;
      clearTimeout(timer);
      removeListeners();

      // Arranca la entrada del hero; su foto aparece ya colocada
      root.classList.remove('intro-playing');
      root.classList.add('intro-done');

      const heroPhoto = document.querySelector('.topology__photo')?.getBoundingClientRect();
      const me = overlay.querySelector('.intro__me');
      const meRect = me?.getBoundingClientRect();
      const hasTarget = heroPhoto && heroPhoto.width > 0;
      const cx = hasTarget ? heroPhoto.left + heroPhoto.width / 2 : window.innerWidth / 2;
      const cy = hasTarget ? heroPhoto.top + heroPhoto.height / 2 : window.innerHeight / 2;

      const openHole = () => {
        overlay.style.setProperty('--rx', `${cx}px`);
        overlay.style.setProperty('--ry', `${cy}px`);
        overlay.classList.toggle('is-fast', fast);
        void overlay.offsetWidth; // fija el estado inicial antes de animar
        overlay.classList.add('is-revealing');
        setTimeout(finish, fast ? 440 : 780);
      };

      if (fast || !hasTarget || !meRect) {
        openHole();
        return;
      }

      // La foto de la intro vuela hasta la foto del hero y, al llegar, se abre la web a su alrededor
      const dx = cx - (meRect.left + meRect.width / 2);
      const dy = cy - (meRect.top + meRect.height / 2);
      const scale = heroPhoto.width / meRect.width;
      overlay.classList.add('is-leaving');
      me.classList.add('is-flying');
      me.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      setTimeout(openHole, 440);
    };

    const skip = () => reveal(true);
    const removeListeners = () => {
      overlay.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
    };

    overlay.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });
    timer = setTimeout(() => reveal(false), AUTO_REVEAL_MS);
  });
}
