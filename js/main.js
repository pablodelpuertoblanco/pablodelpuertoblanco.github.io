/* Punto de entrada: lee los datos, pinta las secciones y activa la interacción. */

import data from '../data/portfolio.js';
import { h, prefersReducedMotion } from './lib/dom.js';
import { createContent } from './lib/content.js';
import { injectStructuredData } from './lib/seo.js';

import { renderHeader } from './render/header.js';
import { renderHero } from './render/hero.js';
import { renderAbout } from './render/about.js';
import { renderExperience } from './render/experience.js';
import { renderSkills } from './render/skills.js';
import { renderProjects } from './render/projects.js';
import { renderEducation } from './render/education.js';
import { renderPlaces } from './render/places.js';
import { techRibbon } from './render/visuals.js';
import { renderCV } from './render/cv.js';
import { renderContact } from './render/contact.js';
import { renderFooter } from './render/footer.js';

import { initTheme } from './ui/theme.js';
import { initNav } from './ui/nav.js';
import { initReveal, initTimelines } from './ui/motion.js';
import { initTopology } from './ui/topology.js';
import { playIntro } from './ui/intro.js';
import { initProjects } from './ui/projects.js';
import { initCVViewer } from './ui/cv-viewer.js';
import { initContactForm } from './ui/contact-form.js';
import { initCopyButtons } from './ui/copy.js';
import { initPlaces } from './ui/places.js';
import { initEffects } from './ui/effects.js';

function render() {
  const c = createContent(data.ajustes);
  const root = document.documentElement;
  if (!prefersReducedMotion()) root.classList.add('has-motion');

  // Secciones en orden; las que no tienen datos devuelven null y no se pintan
  const sections = [
    renderHero(data, c),
    renderAbout(data, c),
    renderExperience(data, c),
    renderSkills(data, c),
    renderProjects(data, c),
    renderEducation(data, c),
    renderPlaces(data, c),
    renderCV(data, c),
    renderContact(data, c),
  ].filter(Boolean);
  const ids = sections.map((s) => s.id);

  // Cinta de tecnologías justo después del hero (decorativa)
  const ribbon = data.ajustes?.animaciones !== false ? techRibbon(data, c) : null;
  if (ribbon) sections.splice(1, 0, ribbon);

  const app = document.getElementById('app');
  app.replaceChildren(
    renderHeader(data, c, ids),
    h('main', { id: 'contenido', tabindex: '-1' }, sections),
    renderFooter(data, c, ids),
  );

  initTheme(data.ajustes?.temaPorDefecto);
  initNav();
  initReveal();
  initTimelines();
  initProjects(data, c);
  initCVViewer(data.cv);
  initContactForm(data.perfil.email);
  initCopyButtons();
  initPlaces(data, c);
  initEffects(data.ajustes);
  injectStructuredData(data, c);

  root.dataset.ready = 'true';

  // Intro del "apretón de manos" y, al terminar, la topología interactiva del hero
  playIntro(data).then(initTopology);
}

try {
  render();
} catch (error) {
  // Si un dato tiene un formato inesperado, se avisa en la consola con el motivo
  console.error('[portfolio] No se pudo pintar la página. Revisa data/portfolio.js.', error);
  document.getElementById('app').textContent =
    'No se ha podido cargar el portfolio. Revisa la consola del navegador (F12) para ver el motivo.';
}
