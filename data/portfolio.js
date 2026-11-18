/* =============================================================================
   DATOS DEL PORTFOLIO
   -----------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas tocar para actualizar la web.

   Reglas rápidas:
   • Si escribes un texto que empiece por "EDITAR" (para acordarte de completarlo),
     no se publica mientras ajustes.mostrarPlaceholders sea false.
   • Los campos vacíos ('') u omitidos no se muestran.
   • "icono" usa los nombres de js/lib/icons.js (java, kotlin, flutter, mysql…).
     Si el nombre no existe, se dibuja un monograma con las iniciales.
   • Fechas en formato 'AAAA-MM' (o 'AAAA'). Usa 'actualidad' para lo que sigue en curso.

   Origen de los datos: tu CV (junio de 2026) y lo que me has ido contando.
   ========================================================================== */

export default {
  ajustes: {
    mostrarPlaceholders: false, // true para ver marcados los textos que empiecen por EDITAR
    temaPorDefecto: 'oscuro', // 'oscuro' | 'claro' (el visitante puede cambiarlo)
    intro: true, // animación de entrada (una vez por visita). false para quitarla
    urlSitio: 'https://pablodelpuertoblanco.github.io/', // URL pública de la web (datos estructurados de SEO)
    animaciones: true, // false deja la web sobria: sin cinta, terminal, demos ni efectos
  },

  perfil: {
    nombre: 'Pablo',
    apellidos: 'del Puerto Blanco',
    rol: 'Programador y técnico IT',
    ubicacion: 'Madrid, España',

    // Indicador verde/ámbar del hero. Pon disponible: false para ocultarlo.
    disponible: true,
    textoDisponible: 'Abierto a nuevas oportunidades',

    resumen:
      'Formado en Desarrollo de Aplicaciones Multiplataforma (DAM) y cursando ahora ' +
      'Administración de Sistemas Informáticos en Red (ASIR). He trabajado como desarrollador ' +
      'web en GD Systems, creando paneles de Power BI e integrando datos de distintas fuentes y APIs.',

    // Frase tomada de tus propias reglas de trabajo. Cámbiala si prefieres otra.
    filosofia: 'Construir solo lo que aporta valor real.',

    foto: {
      src: 'assets/img/avatar.webp', // sustituye el archivo o cambia la ruta
      alt: 'Fotografía de Pablo del Puerto',
    },

    email: 'delpuertoblancopablo@gmail.com',
    telefono: '+34 629 18 13 21',
    mostrarTelefono: false, // tu teléfono quedaría público; actívalo solo si lo quieres
  },

  enlaces: {
    github: 'https://github.com/pablodelpuertoblanco',
    linkedin: 'https://www.linkedin.com/in/pablo-del-puerto-blanco-4aa49b38a/',
    // Otros perfiles (Stack Overflow, blog, X…). Ejemplo:
    // { nombre: 'Blog', url: 'https://…', icono: 'globe' }
    otros: [],
  },

  // Nodos de la animación del hero (tus áreas). x/y en % dentro del diagrama.
  hero: {
    // Frases que se van escribiendo solas bajo tu nombre (la primera es tu rol).
    roles: [
      'Programador y técnico IT',
      'Desarrollador de apps Android y Flutter',
      'Estudiante de ASIR: sistemas y redes',
      'Paneles de datos con Power BI',
    ],
    nodos: [
      { etiqueta: 'Apps móviles', icono: 'smartphone', x: 24, y: 14 },
      { etiqueta: 'Sistemas y redes', icono: 'server', x: 78, y: 21 },
      { etiqueta: 'Datos y Power BI', icono: 'chart-column', x: 77, y: 84 },
      { etiqueta: 'Web', icono: 'globe', x: 20, y: 74 },
    ],
  },

  sobreMi: {
    intro:
      'Soy Pablo, programador y técnico IT en Madrid. Me considero una persona entusiasta, ' +
      'dinámica y responsable, con muchas ganas de aprender y de crecer personal y profesionalmente.',
    bloques: [
      {
        titulo: 'Trayectoria',
        texto:
          'Me formé en Desarrollo de Aplicaciones Multiplataforma en el Colegio Salesiano Santo ' +
          'Domingo Savio y hoy curso ASIR en el IES Juan de la Cierva para sumar sistemas y redes ' +
          'a la parte de desarrollo.',
      },
      {
        titulo: 'Experiencia',
        texto:
          'En GD Systems construí paneles de Power BI para seguir KPIs, preparé datos de varias ' +
          'fuentes y APIs, automaticé informes y mantuve webs en WordPress con Divi.',
      },
      {
        titulo: 'Qué me interesa',
        texto:
          'Las aplicaciones móviles útiles y bien hechas, y cómo la inteligencia artificial y la ' +
          'automatización pueden mejorarlas cuando aportan algo de verdad.',
      },
      {
        titulo: 'Cómo trabajo',
        texto:
          'Divido los proyectos en tareas pequeñas, escribo código limpio y mantenible y me gusta ' +
          'entender el porqué de cada decisión técnica.',
      },
      {
        titulo: 'Hacia dónde voy',
        texto:
          'Quiero centrarme en el desarrollo de aplicaciones móviles: productos modernos, ' +
          'preparados para crecer y que resuelvan problemas reales.',
      },
    ],
    datos: [
      { etiqueta: 'Ubicación', valor: 'Madrid' },
      { etiqueta: 'Idiomas', valor: 'Español nativo, inglés intermedio' },
      { etiqueta: 'Ahora', valor: 'Cursando ASIR' },
      { etiqueta: 'Objetivo', valor: 'Desarrollo de apps móviles' },
    ],
  },

  // Añade, quita o reordena experiencias. La más reciente, primero.
  experiencia: [
    {
      empresa: 'GD Systems',
      url: '', // web de la empresa (opcional)
      puesto: 'Desarrollador web',
      inicio: '2025-01',
      fin: '2025-06',
      descripcion:
        'Análisis y visualización de datos para negocio, y desarrollo y mantenimiento de sitios web.',
      responsabilidades: [
        'Desarrollo y mantenimiento de paneles interactivos en Power BI para analizar, visualizar y monitorizar indicadores clave (KPIs).',
        'Modelado, limpieza y transformación de datos para que los informes sean fiables y de calidad.',
        'Integración de datos de distintas fuentes y APIs para centralizar el análisis y apoyar la toma de decisiones.',
        'Desarrollo y mantenimiento de sitios web en WordPress con Divi, integrando soluciones de datos.',
      ],
      logros: [
        'Automaticé y optimicé informes, haciendo más eficientes los procesos de análisis.',
      ],
      tecnologias: ['Power BI', 'WordPress', 'Divi', 'APIs'],
      // Animación ilustrativa dentro de la tarjeta ('panel-datos' o '' para quitarla)
      visual: 'panel-datos',
      // Ubicación para el mapa del recorrido. "maps" es el enlace de Google Maps.
      lugar: {
        direccion: 'C. Gamonal, 16, Villa de Vallecas, 28031 Madrid',
        zona: 'Villa de Vallecas',
        lat: 40.3726761,
        lng: -3.6438693,
        placeId: 'ChIJj0r-edUmQg0Risjzayj1XAM',
      },
    },
    // {
    //   empresa: 'Nombre de la empresa',
    //   puesto: 'Tu puesto',
    //   inicio: '2026-09',
    //   fin: 'actualidad',
    //   descripcion: '…',
    //   responsabilidades: ['…'],
    //   logros: ['…'],
    //   tecnologias: ['…'],
    // },
  ],

  // Habilidades por categoría. Las categorías vacías no se muestran.
  habilidades: [
    {
      categoria: 'Lenguajes de programación',
      icono: 'code',
      items: [
        { nombre: 'Java', icono: 'java' },
        { nombre: 'Kotlin', icono: 'kotlin' },
        { nombre: 'JavaScript', icono: 'javascript' },
        { nombre: 'Dart', icono: 'dart' }, // de tu proyecto Colchón
      ],
    },
    {
      categoria: 'Desarrollo frontend',
      icono: 'layout',
      items: [
        { nombre: 'HTML', icono: 'html' },
        { nombre: 'CSS', icono: 'css' },
        { nombre: 'WordPress', icono: 'wordpress' },
        { nombre: 'Divi' },
      ],
    },
    {
      categoria: 'Desarrollo backend',
      icono: 'server',
      items: [
        { nombre: 'Spring Boot', icono: 'springboot' }, // backend de PlaySwipe
        { nombre: 'APIs REST', icono: 'cable' },
        { nombre: 'Firebase', icono: 'firebase' },
      ],
    },
    {
      categoria: 'Bases de datos',
      icono: 'database',
      items: [
        { nombre: 'MySQL', icono: 'mysql' },
        { nombre: 'SQLite', icono: 'sqlite' }, // Colchón usa Drift sobre SQLite
      ],
    },
    {
      categoria: 'Desarrollo de aplicaciones',
      icono: 'smartphone',
      items: [
        { nombre: 'Android', icono: 'android' },
        { nombre: 'Jetpack Compose', icono: 'jetpack-compose' }, // PlaySwipe
        { nombre: 'Flutter', icono: 'flutter' },
      ],
    },
    {
      categoria: 'Herramientas y entornos',
      icono: 'wrench',
      items: [
        { nombre: 'Visual Studio Code', icono: 'vscode' },
        { nombre: 'Android Studio', icono: 'android-studio' },
        { nombre: 'Postman', icono: 'postman' },
      ],
    },
    {
      categoria: 'Control de versiones',
      icono: 'git-branch',
      items: [
        { nombre: 'Git', icono: 'git' },
        { nombre: 'GitHub', icono: 'github' },
      ],
    },
    {
      categoria: 'Sistemas operativos',
      icono: 'monitor',
      items: [
        { nombre: 'Linux', icono: 'linux' },
        { nombre: 'Windows', icono: 'windows' },
      ],
    },
    {
      categoria: 'Otras tecnologías',
      icono: 'network',
      items: [
        { nombre: 'Power BI', icono: 'chart-column' },
        { nombre: 'Redes con Cisco Packet Tracer', icono: 'cisco' },
        { nombre: 'AWS', icono: 'aws' }, // PlaySwipe usaba Amazon RDS. En tu CV ponía "AMS".
      ],
    },
  ],

  // Programas que usas, con una frase sobre para qué.
  herramientas: [
    {
      categoria: 'Desarrollo',
      items: [
        {
          nombre: 'Visual Studio Code',
          icono: 'vscode',
          descripcion: 'Editor de código para el día a día.',
        },
        {
          nombre: 'Android Studio',
          icono: 'android-studio',
          descripcion: 'Compilar, ejecutar y depurar apps Android y Flutter.',
        },
        {
          nombre: 'Postman',
          icono: 'postman',
          descripcion: 'Probar y documentar peticiones a APIs.',
        },
        {
          nombre: 'Git y GitHub',
          icono: 'github',
          descripcion: 'Control de versiones y repositorios de mis proyectos.',
        },
      ],
    },
    {
      categoria: 'Datos y web',
      items: [
        {
          nombre: 'Power BI',
          icono: 'chart-column',
          descripcion: 'Paneles e informes interactivos para seguir KPIs.',
        },
        {
          nombre: 'WordPress y Divi',
          icono: 'wordpress',
          descripcion: 'Crear y mantener webs con un constructor visual.',
        },
      ],
    },
    {
      categoria: 'Redes y sistemas',
      items: [
        {
          nombre: 'Cisco Packet Tracer',
          icono: 'cisco',
          descripcion: 'Diseñar y simular redes antes de montarlas.',
        },
      ],
    },
    // Ejemplos para añadir (icono disponible entre paréntesis):
    // Figma (figma), Docker (docker), IntelliJ IDEA (intellij), Microsoft Office (office),
    // Adobe Photoshop (adobe), MySQL Workbench (mysql)
  ],

  // Proyectos. "categorias" alimenta los filtros. "imagen" es opcional:
  // sin imagen se genera una portada a partir del nombre.
  // "github" admite enlaces de GitHub o GitLab (el icono se elige solo).
  // "rol" (opcional) aparece en el detalle como "Mi papel"; úsalo en proyectos de equipo.
  proyectos: [
    {
      id: 'playswipe',
      nombre: 'PlaySwipe',
      categorias: ['Apps móviles'],
      estado: 'Proyecto final de DAM',
      resumen:
        'Descubre música deslizando: a la derecha guardas la canción en tu playlist; a la izquierda, pasas a otra.',
      descripcion:
        'App Android hecha en equipo como proyecto final del ciclo de DAM. Reproduce canciones al azar sin ' +
        'repetir las últimas escuchadas y cada gesto decide qué se queda en tu playlist. Tiene una parte social ' +
        'para añadir amigos y ver sus perfiles. Por detrás hay una API REST propia en Spring Boot con MySQL en ' +
        'AWS, y los archivos (MP3, portadas y fotos de perfil) se guardaban en Firebase Storage.',
      funcionalidades: [
        'Reproductor con gestos: deslizar a la derecha guarda la canción; a la izquierda, la salta.',
        'Reproducción aleatoria que no repite las canciones recientes.',
        'Subida de canciones con su MP3 y su portada.',
        'Playlist personal: cambiar nombre y portada, quitar canciones.',
        'Amigos: enviar y aceptar solicitudes, ver el perfil de cada amigo.',
        'Registro, inicio de sesión, perfil con foto, buscador y ajustes de cuenta.',
      ],
      tecnologias: [
        'Kotlin',
        'Jetpack Compose',
        'Spring Boot',
        'MySQL (Amazon RDS)',
        'Firebase Storage',
        'Retrofit',
        'ExoPlayer',
      ],
      imagen: 'assets/img/proyectos/playswipe.webp',
      // Versión limpia del código: sin claves ni historial antiguo.
      github: 'https://github.com/pablodelpuertoblanco/playswipe',
      demo: '',
      rol: '', // qué hiciste tú en el equipo; si lo rellenas aparece como "Mi papel"
      animacion: 'swipe', // demo animada de la portada: 'swipe' | 'finanzas' | ''
      nota: 'El servidor ya no está activo: la ficha explica cómo funcionaba.',
    },
    {
      id: 'colchon',
      nombre: 'Colchón',
      categorias: ['Apps móviles'],
      estado: 'En desarrollo',
      resumen:
        'App móvil para llevar la economía de un hogar: gastos, ingresos, presupuestos y lista de la compra.',
      descripcion:
        'Aplicación Flutter que funciona sin conexión y guarda los datos en el propio móvil. ' +
        'Permite registrar movimientos, planificar el año por categorías y comparar lo previsto con lo real.',
      funcionalidades: [
        'Gastos e ingresos con categorías y movimientos recurrentes.',
        'Estadísticas y calendario de movimientos.',
        'Presupuestos y plan anual: previsto frente a real.',
        'Plan anual importable desde Excel (.xlsx), con plantilla incluida.',
        'Regla 50/30/20 con objetivos configurables.',
        'Lista de la compra.',
        'Exportación a CSV y copias de seguridad.',
      ],
      tecnologias: ['Flutter', 'Dart', 'Riverpod', 'Drift (SQLite)', 'fl_chart'],
      imagen: '', // p. ej. 'assets/img/proyectos/colchon.webp'
      github: 'https://github.com/pablodelpuertoblanco/colchon',
      demo: '',
      nota: '',
      animacion: 'finanzas',
    },
  ],

  formacion: {
    estudios: [
      {
        titulo: 'Grado Superior en Administración de Sistemas Informáticos en Red (ASIR)',
        centro: 'IES Juan de la Cierva',
        inicio: '2025',
        fin: 'actualidad',
        descripcion: '',
        lugar: {
          direccion: 'C. de la Caoba, 1, Arganzuela, 28005 Madrid',
          zona: 'Arganzuela',
          lat: 40.4022742,
          lng: -3.7064409,
          placeId: 'ChIJJQHQh80nQg0RScRbYtFLSbk',
        },
      },
      {
        titulo: 'Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
        centro: 'Colegio Salesiano Santo Domingo Savio',
        inicio: '2023',
        fin: '2025',
        descripcion: '',
        lugar: {
          direccion: 'C. Santo Domingo Savio, 2, Ciudad Lineal, 28017 Madrid',
          zona: 'Ciudad Lineal',
          lat: 40.4304597,
          lng: -3.6342742,
          placeId: 'ChIJV1XSKmwvQg0RGXPr31n3iV8',
        },
      },
    ],
    // "url" (opcional): enlace a la credencial, p. ej. tu insignia de Credly.
    certificaciones: [
      {
        nombre: 'NDG Linux Unhatched',
        emisor: 'Cisco Networking Academy',
        url: '',
      },
      {
        nombre: 'Exploración de redes con Cisco Packet Tracer',
        emisor: 'Cisco Networking Academy',
        url: '',
      },
    ],
    // Cursos especializados (mismo formato que certificaciones).
    cursos: [],
  },

  cv: {
    archivo: 'cv/CV.pdf', // sustituye este archivo por la versión nueva con el mismo nombre
    nombreDescarga: 'CV-Pablo-del-Puerto-Blanco.pdf',
    detalle: 'PDF, 1 página',
    actualizado: 'junio de 2026',
  },

  contacto: {
    texto:
      'Si buscas a alguien para tu equipo o tienes un proyecto en mente, escríbeme y te responderé lo antes posible.',
    formulario: {
      // Los mensajes llegan a tu correo a través de FormSubmit (gratis, sin registro).
      // El PRIMER mensaje que se envíe desde la web publicada hará que FormSubmit te mande
      // un correo de activación: pulsa "Activate Form" y a partir de ahí te llegarán todos.
      // Mientras no esté activado (o si el servicio falla), el formulario abre el correo
      // del visitante con el mensaje ya escrito, así que ningún mensaje se pierde.
      // Tras activarlo, FormSubmit te da un código aleatorio: puedes sustituir tu email
      // por ese código en esta URL para no mostrar tu correo en el código de la web.
      // Si dejas el endpoint vacío, el botón abre el programa de correo del visitante.
      endpoint: 'https://formsubmit.co/ajax/delpuertoblancopablo@gmail.com',
      servicio: 'FormSubmit', // se menciona en el aviso de privacidad del formulario
    },
  },

  footer: {
    mensaje: 'Programador y técnico IT en Madrid. Web hecha a mano con HTML, CSS y JavaScript.',
  },
};
