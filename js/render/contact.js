import { breakable, h, iconNode } from '../lib/dom.js';
import { profileLinks, section, sectionHead } from './common.js';

function channel({ icon, label, value, href, external, copy, pending }) {
  return h(
    'li',
    { class: `channel ${pending ? 'is-placeholder' : ''}`.trim() },
    h('span', { class: 'channel__icon', 'aria-hidden': 'true' }, iconNode(icon)),
    h(
      'div',
      {},
      h('span', { class: 'channel__label' }, label),
      href
        ? h('a', { class: 'channel__value', href, target: external ? '_blank' : null, rel: external ? 'noopener noreferrer' : null }, typeof value === 'string' ? breakable(value) : value)
        : h('span', { class: 'channel__value' }, typeof value === 'string' ? breakable(value) : value),
    ),
    copy
      ? h(
          'button',
          { class: 'icon-btn channel__copy', type: 'button', 'data-copy': copy, 'aria-label': `Copiar ${label.toLowerCase()}`, title: 'Copiar' },
          iconNode('copy'),
        )
      : null,
  );
}

function field({ id, label, type = 'text', name, autocomplete, placeholder, textarea = false, min, max }) {
  const control = textarea
    ? h('textarea', { class: 'field__input', id, name, required: true, minlength: min, maxlength: max, placeholder, 'aria-describedby': `${id}-error`, rows: 6 })
    : h('input', { class: 'field__input', id, name, type, required: true, minlength: min, maxlength: max, autocomplete, placeholder, 'aria-describedby': `${id}-error` });
  return h(
    'div',
    { class: 'field' },
    h('label', { class: 'field__label', for: id }, label),
    control,
    h('p', { class: 'field__error', id: `${id}-error` }),
  );
}

export function renderContact(data, c) {
  const { perfil, contacto = {} } = data;
  const links = profileLinks(data, c);
  const channels = [];

  if (c.has(perfil.email)) {
    channels.push({ icon: 'mail', label: 'Correo electrónico', value: perfil.email, href: `mailto:${perfil.email}`, copy: perfil.email });
  }
  for (const l of links.filter((x) => x.key !== 'email')) {
    channels.push({
      icon: l.icon,
      label: l.label,
      value: l.pending ? c.text(data.enlaces[l.key]) : l.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      href: l.href,
      external: l.external,
      pending: l.pending,
    });
  }
  if (perfil.mostrarTelefono && c.has(perfil.telefono)) {
    channels.push({ icon: 'phone', label: 'Teléfono', value: perfil.telefono, href: `tel:${perfil.telefono.replace(/\s+/g, '')}` });
  }
  if (c.has(perfil.ubicacion)) channels.push({ icon: 'map-pin', label: 'Ubicación', value: perfil.ubicacion });

  const form = h(
    'form',
    {
      class: 'contact__form',
      novalidate: true,
      'data-contact-form': '',
      'data-endpoint': contacto.formulario?.endpoint || '',
      'aria-labelledby': 'contact-form-title',
    },
    h('h3', { class: 'visually-hidden', id: 'contact-form-title' }, 'Formulario de contacto'),
    h(
      'div',
      { class: 'contact__row' },
      field({ id: 'cf-name', name: 'nombre', label: 'Nombre', autocomplete: 'name', min: 2, max: 80 }),
      field({ id: 'cf-email', name: 'email', label: 'Correo electrónico', type: 'email', autocomplete: 'email', max: 120 }),
    ),
    field({ id: 'cf-subject', name: 'asunto', label: 'Asunto', min: 3, max: 120 }),
    field({ id: 'cf-message', name: 'mensaje', label: 'Mensaje', textarea: true, min: 10, max: 2000 }),
    // Campo trampa: las personas no lo ven; si se rellena, es un bot
    h(
      'div',
      { class: 'hp', 'aria-hidden': 'true' },
      h('label', { for: 'cf-web' }, 'No rellenes este campo'),
      h('input', { id: 'cf-web', name: '_gotcha', type: 'text', tabindex: '-1', autocomplete: 'off' }),
    ),
    h(
      'div',
      { class: 'field' },
      h(
        'label',
        { class: 'check' },
        h('input', { type: 'checkbox', id: 'cf-consent', name: 'consentimiento', required: true, 'aria-describedby': 'cf-consent-error' }),
        h('span', {}, `Acepto que ${perfil.nombre} use estos datos solo para responder a mi mensaje.`),
      ),
      h('p', { class: 'field__error', id: 'cf-consent-error' }),
      c.has(contacto.formulario?.endpoint) && c.has(contacto.formulario?.servicio)
        ? h('p', { class: 'form-note' }, `El mensaje me llega por correo a través de ${contacto.formulario.servicio}.`)
        : null,
    ),
    h('div', { class: 'form-status', role: 'status', 'aria-live': 'polite', 'data-form-status': '' }),
    h(
      'div',
      { class: 'form-actions' },
      h('button', { class: 'btn btn--primary', type: 'submit' }, iconNode('send'), h('span', {}, 'Enviar mensaje')),
      h('p', { class: 'form-note' }, 'Todos los campos son obligatorios.'),
    ),
  );

  return section(
    { id: 'contacto', labelledBy: 'contact-title', className: 'contact' },
    h(
      'div',
      { class: 'contact__grid' },
      h(
        'div',
        { class: 'contact__intro' },
        sectionHead({ title: 'Contacto', id: 'contact-title', lead: contacto.texto }),
        channels.length ? h('ul', { class: 'channels', role: 'list', 'data-reveal': '' }, channels.map(channel)) : null,
      ),
      form,
    ),
  );
}
