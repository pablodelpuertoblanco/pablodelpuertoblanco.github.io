# Portfolio de Pablo del Puerto Blanco

Web personal de presentación como programador y técnico IT, publicada en **https://pablodelpuertoblanco.github.io**. Hecha con HTML, CSS y JavaScript (módulos ES), sin frameworks, sin dependencias y sin paso de compilación.

- Modo oscuro (principal) y claro. Se recuerda la elección de cada visitante.
- Responsive: móvil, tablet y escritorio.
- Todo el contenido sale de **un solo archivo**: `data/portfolio.js`.
- El CV se descarga de verdad y se puede ver antes en un visor.
- Formulario con validación que envía los mensajes a tu correo (FormSubmit).
- Intro animada (un "apretón de manos" de red entre el visitante y tú) y hero interactivo con forma de topología de red.
- SEO básico, datos estructurados (schema.org), accesible con teclado y respeta "reducir movimiento".

---

## 1. Ejecutar en local

Los navegadores bloquean los módulos de JavaScript si abres `index.html` con doble clic, así que necesitas un servidor local. Si lo abres con doble clic, la página te lo recordará con un aviso. Elige una opción:

| Opción | Cómo |
| --- | --- |
| **VS Code + Live Server** (recomendada) | Instala la extensión *Live Server*, abre la carpeta y pulsa **Go Live** (abajo a la derecha). Se recarga sola al guardar. |
| Node.js | En la carpeta del proyecto: `npx serve` y abre la URL que indique. |
| Python | En la carpeta del proyecto: `python -m http.server 8000` y abre http://localhost:8000 |

---

## 2. Estructura

```
portfolio/
├── index.html            Estructura base, SEO y metaetiquetas para redes
├── 404.html              Página de error
├── .nojekyll            Indica a GitHub Pages que publique los archivos tal cual
├── data/
│   └── portfolio.js      ← TODOS tus datos. Es el único archivo que tienes que editar
├── css/
│   ├── tokens.css        Colores, tipografía, espaciado (identidad visual)
│   ├── base.css          Reset, tipografía base, accesibilidad
│   ├── components.css    Botones, etiquetas, diálogos, formulario
│   └── sections.css      Estilos de cada sección
├── js/
│   ├── main.js           Punto de entrada: lee los datos, pinta y activa todo
│   ├── render/           Una función por sección (hero, about, experience…)
│   ├── ui/               Interacción: tema, menú, filtros, diálogos, formulario…
│   └── lib/              Utilidades: DOM seguro, fechas, marcas EDITAR, iconos, SEO
├── assets/img/           Foto, favicon, imagen para redes (og-image.png)
├── cv/CV.pdf             Tu currículum
└── extras/og-image.html  Plantilla para regenerar la imagen de redes
```

Cómo funciona: `main.js` importa `data/portfolio.js`. Cada módulo de `render/` convierte su parte de los datos en HTML y cada módulo de `ui/` añade el comportamiento. Si una sección no tiene datos, no se muestra. Así nunca hay secciones vacías.

---

## 3. Personalizar

Todo se edita en **`data/portfolio.js`**. El archivo lleva comentarios en cada bloque.

| Quiero cambiar… | Dónde |
| --- | --- |
| Nombre, rol, resumen, frase | `perfil` |
| Indicador "Abierto a nuevas oportunidades" | `perfil.disponible` y `perfil.textoDisponible` |
| GitHub, LinkedIn, otros perfiles | `enlaces` |
| Áreas del diagrama del hero | `hero.nodos` (posición `x`/`y` en %) |
| Texto de "Sobre mí" y datos rápidos | `sobreMi` |
| Experiencia laboral | `experiencia` (añade un objeto por empleo; el más reciente, primero) |
| Habilidades | `habilidades` (por categorías) |
| Programas que usas | `herramientas` |
| Proyectos | `proyectos` |
| Estudios, certificaciones, cursos | `formacion` |
| CV | `cv` |
| Texto y envío del formulario | `contacto` |
| Mensaje del pie | `footer` |

### Textos provisionales (EDITAR)

Ahora mismo no queda ningún texto provisional y `ajustes.mostrarPlaceholders` está en `false`. Si algún día quieres dejarte un recordatorio, escribe un texto que empiece por `EDITAR:`: no se publica mientras el ajuste siga en `false`, y con `true` lo verás marcado en ámbar para localizarlo.

### Mapa del recorrido (Google Maps)

La sección **Recorrido** sale de los campos `lugar` de `experiencia` y de `formacion.estudios`:

```js
lugar: {
  direccion: 'C. Gamonal, 16, Villa de Vallecas, 28031 Madrid',
  zona: 'Villa de Vallecas',   // texto corto de la chincheta
  lat: 40.3726761,
  lng: -3.6438693,
  placeId: 'ChIJ…',            // opcional: hace que Google abra la ficha exacta
},
```

- Para un sitio nuevo: búscalo en Google Maps, haz clic derecho sobre el punto y copia las coordenadas (latitud, longitud). Sin `lugar`, ese sitio simplemente no sale en el mapa.
- El plano dibujado es esquemático (M-30, río y poco más) y cubre Madrid capital. Las chinchetas se colocan solas a partir de `lat` y `lng`.
- El mapa real de Google se carga **solo cuando el visitante pulsa** una chincheta, "Ver en el mapa" o la dirección de un timeline. Hasta entonces no se conecta con Google.

### Fechas

Formato `'AAAA-MM'` (o solo `'AAAA'`). Usa `'actualidad'` para lo que sigue en curso. La duración ("6 meses", "1 año y 2 meses") se calcula sola.

### Foto

Sustituye `assets/img/avatar.webp` por otra foto **cuadrada** (mínimo 360×360). Si usas otro nombre o formato, cambia `perfil.foto.src`.

### CV

Sustituye `cv/CV.pdf` por la versión nueva **con el mismo nombre**. Actualiza también `cv.actualizado` y `cv.detalle` si cambia el número de páginas. El visitante lo descarga como `cv.nombreDescarga`.

### Capturas de proyectos

Guarda la imagen en `assets/img/proyectos/` (formato 16:9, por ejemplo 1280×720, en WebP o JPG) y pon la ruta en `imagen`. Sin imagen, se genera una portada con la inicial del proyecto.

### Iconos

En los campos `icono` puedes usar estos nombres:

```
Interfaz:  download, eye, github, linkedin, mail, sun, moon, menu, close, map-pin, external-link,
           file-text, send, briefcase, graduation-cap, award, code, server, database, smartphone,
           wrench, git-branch, monitor, layers, globe, network, chart-column, languages, phone,
           terminal, calendar, building, info, puzzle, cpu, router, cable, layout, plus
Marcas:    java, kotlin, javascript, typescript, python, dart, html, css, react, nodejs, flutter,
           android, android-studio, mysql, sqlite, firebase, supabase, postman, wordpress, linux,
           ubuntu, cisco, git, gitlab, github-mark, vscode, intellij, figma, docker, bash, office, adobe,
           windows, springboot, jetpack-compose, aws
```

Si escribes un nombre que no existe, se muestra un monograma con las iniciales (por ejemplo, "Di" para Divi).

### Colores y tipografía

En `css/tokens.css`. El marino `#062446` es el mismo de tu CV y el acento ámbar `#FFB547` imita los LED de actividad de un switch. Cada tema (oscuro y claro) tiene su bloque de variables.

### Animaciones

- **Intro:** se ve una vez por visita, dura unos 2,5 segundos y se salta con un clic o una tecla. No aparece si el visitante tiene activado "reducir movimiento" ni si entra con un enlace a una sección (por ejemplo `/#contacto`). Para quitarla, pon `ajustes.intro: false`. El código está en `js/ui/intro.js` y `css/intro.css`.
- **Hero:** los paquetes ámbar recorren el diagrama solos y, si el visitante hace clic o toca el diagrama, sale un ping desde tu foto hacia todas tus áreas (es un detalle escondido, sin texto que lo explique). El código está en `js/ui/topology.js`.
- **Resto de animaciones** (`js/ui/effects.js`, `js/render/visuals.js`, `css/animations.css`): barra de progreso de lectura, rol que se escribe solo (frases en `hero.roles`), cinta de tecnologías, terminal de "Sobre mí" (se genera con tus datos), títulos letra a letra, puertos del panel que se encienden en cascada, panel de datos animado en GD Systems (`visual: 'panel-datos'`), demos animadas en las portadas de proyecto (`animacion: 'swipe' | 'finanzas'`), ruta animada del mapa y guía lateral de secciones en pantallas anchas.
- **Apagarlas todas:** `ajustes.animaciones: false`. Además, quien tenga activado "reducir movimiento" en su sistema ve la web quieta y completa sin que hagas nada.
- **Ver la intro otra vez mientras pruebas:** abre la web en una pestaña nueva o borra el *Session Storage* desde las herramientas del navegador (F12 → Application).

### SEO y redes sociales

Google ejecuta JavaScript y lee la página completa. En cambio, las vistas previas de LinkedIn y WhatsApp solo leen las metaetiquetas de `index.html`, por eso están escritas ahí. La dirección de la web (`https://pablodelpuertoblanco.github.io/`) aparece en estos sitios; si algún día cambias de dominio, actualízala en todos:

- `index.html`: `canonical`, `og:url` y `og:image`.
- `robots.txt` y `sitemap.xml`.
- `data/portfolio.js`: `ajustes.urlSitio`.

La imagen para redes es `assets/img/og-image.png` (1200×630). Para regenerarla, abre `extras/og-image.html` con Live Server y haz una captura a 1200×630.

---

## 4. Formulario de contacto

Los mensajes **llegan a tu correo** a través de [FormSubmit](https://formsubmit.co). Es gratis, sin registro y ya está configurado en `contacto.formulario.endpoint`.

**Activación (una sola vez):**
1. Publica la web y envía un mensaje de prueba desde el formulario.
2. Te llegará a `delpuertoblancopablo@gmail.com` un correo de FormSubmit con un botón **Activate Form**. Púlsalo. Si no lo ves, mira en spam o en Promociones.
3. A partir de ahí, cada mensaje te llega como un correo, con el asunto `[Portfolio] …`. Si le das a Responder, contestas directamente a quien te escribió.

Hasta que lo actives (o si algún día el servicio falla), la web avisa al visitante y le ofrece un botón **Enviarlo desde tu correo**, que abre su programa de correo con el mensaje ya escrito y dirigido a ti. Así no se pierde ningún mensaje.

**Opcional: ocultar tu email del código.** Tras activar, FormSubmit te da un código aleatorio. Sustituye tu email por ese código en la URL del endpoint: `https://formsubmit.co/ajax/TU_CODIGO`.

**Alternativas:**
- Si prefieres otro servicio, como Formspree, pega su URL en `endpoint`; el código ya lo admite.
- Si dejas el endpoint vacío, el botón abre el programa de correo del visitante con el mensaje ya escrito.

Además, el formulario incluye:

- Validación de nombre, email, asunto, mensaje y consentimiento, con errores accesibles.
- Un campo trampa contra bots.
- Una espera de 30 segundos entre envíos.
- Un mensaje de confirmación cuando el servicio responde que el envío ha ido bien.

---

## 5. Publicar online (gratis)

### Opción A: GitHub Pages (recomendada)

Tu web sale gratis en **https://pablodelpuertoblanco.github.io**, la misma dirección que enlaza tu perfil de GitHub. No hay que compilar nada: GitHub publica los archivos tal cual (el archivo `.nojekyll` se lo indica).

1. En GitHub, crea un repositorio **público y vacío** llamado exactamente **`pablodelpuertoblanco.github.io`** (tu usuario + `.github.io`). No marques README, `.gitignore` ni licencia.
2. Sube los archivos. Hay dos formas:
   - **Desde la web de GitHub:** en el repositorio vacío, pulsa **uploading an existing file**, arrastra **el contenido** de la carpeta del portfolio (no la carpeta en sí) y pulsa **Commit changes**.
   - **Con Git**, desde la carpeta del portfolio (la que contiene `index.html`):
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/pablodelpuertoblanco/pablodelpuertoblanco.github.io.git
   git push -u origin main
   ```
3. En el repositorio, ve a **Settings → Pages**. En **Build and deployment**, elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**, y pulsa **Save**.
4. Espera 1-2 minutos (el progreso se ve en la pestaña **Actions**) y abre https://pablodelpuertoblanco.github.io.

Para actualizar la web más adelante: sube los archivos cambiados desde la web (**Add file → Upload files**) o con `git add .`, `git commit -m "..."` y `git push`. GitHub la vuelve a publicar sola.

### Opción B: Netlify (arrastrar y soltar)

Entra en https://app.netlify.com/drop y arrastra la carpeta. Te da una URL al instante y puedes ponerle un dominio propio.

### Dominio propio

Un dominio `.com` o `.es` cuesta unos 10-15 € al año. Tanto GitHub Pages (**Settings → Pages → Custom domain**) como Netlify te guían para conectarlo y activan HTTPS automáticamente.

---

## 6. Después de publicar

- [ ] Enviar un mensaje de prueba desde la web publicada y pulsar **Activate Form** en el correo de FormSubmit.
- [ ] Cuando los repositorios de los proyectos estén en GitHub, poner sus enlaces en el campo `github` de cada proyecto.

---

## 7. Privacidad

- **El CV publicado lo puede descargar cualquiera.** Por eso la versión de la web solo lleva el correo y la ciudad (Madrid): sin dirección ni teléfono. Si lo sustituyes, exporta también una versión así.
- El teléfono **no** aparece en la web (`perfil.mostrarTelefono: false`). Actívalo solo si quieres.
- Las fuentes se cargan desde Google Fonts. Si prefieres no enviar datos de tus visitantes a Google (RGPD), descarga Red Hat Display y Red Hat Text en formato WOFF2 (por ejemplo, desde https://gwfh.mranftl.com/fonts). Después:
  1. Guárdalas en `assets/fonts/`.
  2. Declara las fuentes con `@font-face` en `css/tokens.css`.
  3. Quita los `<link>` de Google Fonts de `index.html`.
- El mapa de Google Maps solo se carga cuando el visitante lo pide; al hacerlo, Google recibe su visita como en cualquier mapa incrustado.
- Los mensajes del formulario pasan por los servidores de FormSubmit antes de llegar a tu correo; el formulario lo indica junto a la casilla de consentimiento.

---

## 8. Decisiones técnicas

- **Sin framework ni compilación.** Para una web de una página con contenido estático, React o Next.js añaden dependencias y un paso de build sin aportar nada visible al visitante. Así se puede publicar subiendo la carpeta y cada línea está escrita con tu stack (HTML, CSS y JS).
- **Datos separados de la presentación.** Los componentes no contienen texto: leen `data/portfolio.js`. Añadir un empleo o un proyecto es añadir un objeto.
- **Seguridad.** Los datos se insertan siempre como texto (nunca como HTML) y las URLs se filtran para permitir solo `http(s)`, `mailto` y `tel`. El formulario no ejecuta nada en tu servidor porque no lo hay.
- **Rendimiento.**
  - Sin librerías externas de JavaScript.
  - Iconos SVG en línea.
  - Foto en WebP de pocos KB.
  - La animación del hero se pausa fuera de pantalla y con la pestaña oculta.
- **Accesibilidad.**
  - Enlace "Saltar al contenido".
  - Foco visible.
  - Navegación completa con teclado.
  - Diálogos nativos (`<dialog>`) que devuelven el foco al cerrarse.
  - Errores del formulario anunciados a lectores de pantalla.
  - Contraste AA en ambos temas.
  - Animaciones desactivadas con "reducir movimiento".

---

## 9. Créditos

Iconos:

- [Lucide](https://lucide.dev): ISC.
- [Simple Icons](https://simpleicons.org): CC0.
- [Tabler Icons](https://tabler.io/icons): MIT.
- [Font Awesome Free](https://fontawesome.com): CC BY 4.0 (icono de Java).

Las marcas pertenecen a sus respectivos dueños.

Tipografía: [Red Hat Display y Red Hat Text](https://github.com/RedHatOfficial/RedHatFont), SIL Open Font License.
