/* SEO: datos estructurados (schema.org/Person) generados desde los datos. */

export function injectStructuredData(data, c) {
  const { perfil, enlaces = {}, formacion = {}, ajustes = {} } = data;
  const sameAs = [enlaces.gitlab, enlaces.github, enlaces.linkedin, ...(enlaces.otros || []).map((o) => o.url)].filter(
    (u) => c.has(u) && !c.isPh(u),
  );
  const url = !c.isPh(ajustes.urlSitio) && ajustes.urlSitio ? ajustes.urlSitio : undefined;

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: [perfil.nombre, perfil.apellidos].filter(Boolean).join(' '),
    jobTitle: perfil.rol,
    url,
    email: perfil.email ? `mailto:${perfil.email}` : undefined,
    address: perfil.ubicacion
      ? { '@type': 'PostalAddress', addressLocality: perfil.ubicacion.split(',')[0].trim(), addressCountry: 'ES' }
      : undefined,
    alumniOf: (formacion.estudios || [])
      .filter((e) => c.has(e.centro) && !c.isPh(e.centro))
      .map((e) => ({ '@type': 'EducationalOrganization', name: e.centro })),
    knowsAbout: (data.habilidades || [])
      .flatMap((g) => g.items || [])
      .map((i) => i.nombre)
      .filter((n) => n && !c.isPh(n)),
    sameAs,
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(person);
  document.head.append(script);
}
