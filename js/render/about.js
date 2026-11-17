import { h } from '../lib/dom.js';
import { sectionHead } from './common.js';
import { terminal } from './visuals.js';

export function renderAbout(data, c) {
  const { sobreMi = {} } = data;
  const blocks = c.list(sobreMi.bloques, 'texto');
  const facts = c.list(sobreMi.datos, 'valor');

  return h(
    'section',
    { class: 'section about', id: 'sobre-mi', 'aria-labelledby': 'about-title' },
    h(
      'div',
      { class: 'container about__grid' },
      h(
        'div',
        { class: 'about__aside' },
        sectionHead({ title: 'Sobre mí', id: 'about-title' }),
        facts.length
          ? h(
              'dl',
              { class: 'about__facts', 'data-reveal': '' },
              facts.map((f) =>
                h('div', { class: 'about__fact' }, h('dt', {}, f.etiqueta), h('dd', {}, c.text(f.valor))),
              ),
            )
          : null,
        data.ajustes?.animaciones !== false ? terminal(data, c) : null,
      ),
      h(
        'div',
        { class: 'about__body' },
        c.has(sobreMi.intro) ? h('p', { class: 'about__intro', 'data-reveal': '' }, c.text(sobreMi.intro)) : null,
        blocks.length
          ? h(
              'div',
              { class: 'about__blocks' },
              blocks.map((b, i) =>
                h(
                  'article',
                  { class: 'about__block', 'data-reveal': '', style: { '--reveal-delay': `${(i % 2) * 80}ms` } },
                  h('h3', {}, c.text(b.titulo)),
                  h('p', {}, c.text(b.texto)),
                ),
              ),
            )
          : null,
      ),
    ),
  );
}
