/* Formulario de contacto: validación, envío y confirmación.

   Envío:
   • Con endpoint (Formspree u otro servicio que acepte JSON): se envía con fetch
     y se muestra la confirmación cuando el servicio responde OK.
   • Sin endpoint: se abre el programa de correo del visitante con el mensaje
     ya redactado (mailto). No se dice "enviado" porque el envío lo hace él. */

import { $, h, iconNode } from '../lib/dom.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COOLDOWN_MS = 30_000;

const RULES = {
  nombre: (v) => (v.length < 2 ? 'Escribe tu nombre (mínimo 2 caracteres).' : v.length > 80 ? 'El nombre es demasiado largo.' : ''),
  email: (v) => (!v ? 'Escribe tu correo electrónico.' : !EMAIL_RE.test(v) ? 'Revisa el correo: debe tener el formato nombre@dominio.com.' : ''),
  asunto: (v) => (v.length < 3 ? 'Escribe un asunto (mínimo 3 caracteres).' : v.length > 120 ? 'El asunto es demasiado largo (máximo 120).' : ''),
  mensaje: (v) => (v.length < 10 ? 'Cuéntame algo más (mínimo 10 caracteres).' : v.length > 2000 ? 'El mensaje es demasiado largo (máximo 2000).' : ''),
};

/**
 * Petición según el servicio:
 * • FormSubmit (formsubmit.co/ajax/…): JSON. Los nombres de campo salen tal cual en el correo;
 *   "_subject" es el asunto, "_replyto" permite responder directamente y "_template" da formato de tabla.
 * • Formspree u otros: FormData + Accept: application/json (formato recomendado por Formspree).
 */
function buildRequest(endpoint, payload) {
  const subject = `[Portfolio] ${payload.asunto}`;
  if (/formsubmit\.co/i.test(endpoint)) {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        Nombre: payload.nombre,
        email: payload.email,
        Asunto: payload.asunto,
        Mensaje: payload.mensaje,
        _subject: subject,
        _replyto: payload.email,
        _template: 'table',
      }),
    };
  }
  const body = new FormData();
  for (const [key, value] of Object.entries(payload)) body.append(key, value);
  body.append('_subject', subject);
  return { method: 'POST', headers: { Accept: 'application/json' }, body };
}

export function initContactForm(email) {
  const form = $('[data-contact-form]');
  if (!form) return;
  const status = $('[data-form-status]', form);
  const submit = form.querySelector('button[type="submit"]');
  const consent = form.elements.namedItem('consentimiento');
  const endpoint = (form.dataset.endpoint || '').trim();
  let lastSent = 0;

  const setError = (control, message) => {
    const err = document.getElementById(control.getAttribute('aria-describedby'));
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.replaceChildren(...(message ? [iconNode('circle-alert'), message] : []));
  };

  const validateField = (control) => {
    if (control === consent) {
      const msg = consent.checked ? '' : 'Necesito tu permiso para poder responderte.';
      setError(consent, msg);
      return !msg;
    }
    const rule = RULES[control.name];
    if (!rule) return true;
    const msg = rule(control.value.trim());
    setError(control, msg);
    return !msg;
  };

  const controls = [...Object.keys(RULES).map((n) => form.elements.namedItem(n)), consent];

  // Valida al salir del campo, y en vivo una vez que ya mostró un error
  for (const control of controls) {
    control.addEventListener('blur', () => control.value && validateField(control));
    control.addEventListener('input', () => control.getAttribute('aria-invalid') === 'true' && validateField(control));
    control.addEventListener('change', () => control.type === 'checkbox' && validateField(control));
  }

  const showStatus = (type, message, extra = null) => {
    status.className = `form-status is-${type}`;
    status.replaceChildren(iconNode(type === 'success' ? 'circle-check' : type === 'error' ? 'circle-alert' : 'info'), h('span', {}, message), ...(extra ? [extra] : []));
  };

  /** Enlace mailto con el mensaje ya escrito (plan B si el servicio de envío falla). */
  const mailtoUrl = (payload) => {
    const body = `${payload.mensaje}\n\n— ${payload.nombre} (${payload.email})`;
    return `mailto:${email}?subject=${encodeURIComponent(payload.asunto)}&body=${encodeURIComponent(body)}`;
  };

  /** Pequeña animación de entrega: el paquete viaja del visitante a Pablo. */
  const delivery = () =>
    h('span', { class: 'delivery', 'aria-hidden': 'true' }, 'Tú', h('span', { class: 'delivery__wire' }), 'Pablo');

  const setLoading = (loading) => {
    submit.disabled = loading;
    const icon = iconNode(loading ? 'loader' : 'send');
    if (loading) icon.classList.add('spin');
    submit.replaceChildren(icon, document.createTextNode(loading ? 'Enviando…' : 'Enviar mensaje'));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.replaceChildren();

    const results = controls.map(validateField);
    if (results.includes(false)) {
      controls[results.indexOf(false)].focus();
      return;
    }

    if (Date.now() - lastSent < COOLDOWN_MS) {
      showStatus('info', 'Acabas de enviar un mensaje. Espera unos segundos antes de enviar otro.');
      return;
    }

    const payload = {
      nombre: form.elements.namedItem('nombre').value.trim(),
      email: form.elements.namedItem('email').value.trim(),
      asunto: form.elements.namedItem('asunto').value.trim(),
      mensaje: form.elements.namedItem('mensaje').value.trim(),
    };

    // Bot detectado por el campo trampa: fingimos éxito sin enviar nada
    if (form.elements.namedItem('_gotcha').value) {
      showStatus('success', 'Mensaje enviado. Te responderé lo antes posible.');
      form.reset();
      return;
    }

    if (!endpoint) {
      window.location.href = mailtoUrl(payload);
      showStatus('info', `Se ha abierto tu programa de correo con el mensaje preparado. Si no se abre, escríbeme a ${email}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(endpoint, buildRequest(endpoint, payload));
      let data = null;
      try {
        data = await res.json();
      } catch {
        /* respuesta sin JSON */
      }
      // FormSubmit responde { success: "true" | "false", message }; Formspree, { ok } o { errors }
      const failed = !res.ok || data?.success === false || data?.success === 'false' || Boolean(data?.errors);
      if (failed) throw new Error(String(data?.message || `HTTP ${res.status}`));
      lastSent = Date.now();
      form.reset();
      controls.forEach((c) => c.setAttribute('aria-invalid', 'false'));
      showStatus('success', 'Mensaje enviado. Te responderé lo antes posible.', delivery());
    } catch (error) {
      const pendingActivation = /activ/i.test(error?.message || '');
      // Plan B: el mensaje no se pierde, se puede mandar desde el correo del visitante
      showStatus(
        'error',
        pendingActivation
          ? `El formulario todavía no está activado. Mientras tanto, escríbeme a ${email}.`
          : `No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbeme a ${email}.`,
        h('a', { class: 'btn btn--small form-status__alt', href: mailtoUrl(payload) }, iconNode('mail'), 'Enviarlo desde tu correo'),
      );
    } finally {
      setLoading(false);
    }
  });
}
