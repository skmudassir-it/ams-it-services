// Initial content, taken from amsitservices.com (Portfolios + Blog) and dockpass.org.
// The hosted project list lives in projects-data.json. `apps` below is the previous vercel.app list,
// kept only so the v1 migration in db.js can remove those rows from existing databases.
// [name, url, category, description_en, description_es]
export const apps = [
  ['Peak Roofing', 'https://peak-roofing.vercel.app', 'home', 'Roofing company site with service pages, project gallery and contact forms.', 'Sitio para empresa de techos con páginas de servicios, galería de proyectos y formularios de contacto.'],
  ['Summit Roofing', 'https://summit-roofing.vercel.app', 'home', 'Roofing contractor with project portfolio and online estimate requests.', 'Contratista de techos con portafolio de proyectos y solicitudes de presupuesto en línea.'],
  ['Spark Electric', 'https://spark-electric-six.vercel.app', 'home', 'Electrical services with project portfolio, customer reviews and estimates.', 'Servicios eléctricos con portafolio, reseñas de clientes y presupuestos.'],
  ['Terry Lawn Care', 'https://terry-lawn.vercel.app', 'home', 'Lawn care and landscaping with seasonal service packages.', 'Cuidado de césped y paisajismo con paquetes de servicio por temporada.'],
  ['Crystal Pools', 'https://crystal-pools.vercel.app', 'home', 'Pool construction and maintenance showcase.', 'Escaparate de construcción y mantenimiento de piscinas.'],
  ['SunPath Solar', 'https://solar-installation.vercel.app', 'home', 'Solar installation with savings calculator and consultation booking.', 'Instalación solar con calculadora de ahorro y reserva de consultas.'],
  ['Pro Plumber', 'https://plumber-services-alpha.vercel.app', 'home', 'Plumbing services with emergency response and transparent pricing.', 'Servicios de plomería con respuesta de emergencia y precios transparentes.'],
  ['Building Coolers', 'https://building-coolers.vercel.app', 'home', 'Modular 10-page HVAC website with a full product catalog.', 'Sitio HVAC modular de 10 páginas con catálogo completo de productos.'],
  ['Home Theater AV', 'https://home-theater-av.vercel.app', 'home', 'Home theater installation with product showcase.', 'Instalación de cine en casa con exhibición de productos.'],
  ['FreshClean Pro', 'https://freshclean-pro.vercel.app', 'home', 'Cleaning services with packages and online booking.', 'Servicios de limpieza con paquetes y reservas en línea.'],
  ['Home Organize Pro', 'https://home-organization.vercel.app', 'home', 'Home organization services with before/after gallery.', 'Organización del hogar con galería de antes y después.'],
  ['Nest & Dwell Interiors', 'https://nest-dwell-interiors.vercel.app', 'home', 'Interior design and home staging gallery.', 'Galería de diseño de interiores y home staging.'],
  ['Furniture Revival', 'https://furniture-restoration.vercel.app', 'home', 'Furniture restoration and custom pieces.', 'Restauración de muebles y piezas personalizadas.'],

  ['Catering Chef', 'https://catering-chef.vercel.app', 'food', 'Catering with menus, event types and online booking.', 'Catering con menús, tipos de eventos y reservas en línea.'],
  ['MealPrep Pro', 'https://meal-prep-delivery.vercel.app', 'food', 'Meal prep delivery with nutrition plans and subscriptions.', 'Entrega de comidas preparadas con planes nutricionales y suscripciones.'],
  ['Memphis Food Truck', 'https://mem-food-truck.vercel.app', 'food', 'Food truck with menu, location schedule and catering inquiries.', 'Food truck con menú, horario de ubicaciones y solicitudes de catering.'],
  ['Memphis Indian Restaurant', 'https://memphis-indian-restaurant.vercel.app', 'food', 'Restaurant with categorized menu and reservations.', 'Restaurante con menú por categorías y reservaciones.'],
  ['Rolling Kitchen', 'https://food-truck.vercel.app', 'food', 'Food truck with rotating menu and online ordering.', 'Food truck con menú rotativo y pedidos en línea.'],
  ['Mobile Bartending', 'https://mobile-bartending.vercel.app', 'food', 'Mobile bartending service with drink menus and booking.', 'Servicio de bartender móvil con menús de bebidas y reservas.'],
  ['NewlyWeds Foods', 'https://newly-weds-foods.vercel.app', 'food', 'Global food ingredients manufacturer with product lines.', 'Fabricante global de ingredientes alimentarios con líneas de productos.'],

  ['Mobile Notary', 'https://mobile-notary.vercel.app', 'business', 'Notary services with scheduling and document preparation.', 'Servicios notariales con agenda y preparación de documentos.'],
  ['LedgerPro Bookkeeping', 'https://ledgerpro-bookkeeping.vercel.app', 'business', 'Bookkeeping and tax services with client portal.', 'Contabilidad e impuestos con portal para clientes.'],
  ['TaskFlow Concierge', 'https://taskflow-concierge.vercel.app', 'business', 'Virtual assistant and concierge with task management.', 'Asistente virtual y conserjería con gestión de tareas.'],
  ['ShieldPro Security', 'https://shieldpro-security.vercel.app', 'business', 'Security monitoring services with quote requests.', 'Servicios de monitoreo de seguridad con solicitudes de cotización.'],
  ['LinguaBridge Translation', 'https://linguabridge-translation.vercel.app', 'business', 'Translation and interpretation across 50+ language pairs.', 'Traducción e interpretación en más de 50 pares de idiomas.'],
  ['Translate Pro', 'https://translation-interpretation.vercel.app', 'business', 'Translation services with certified translators.', 'Servicios de traducción con traductores certificados.'],
  ['InsureEase', 'https://insureease.vercel.app', 'business', 'Insurance platform with quotes, claims and policy management.', 'Plataforma de seguros con cotizaciones, reclamos y gestión de pólizas.'],
  ['Same-Day Courier', 'https://same-day-courier.vercel.app', 'business', 'Express courier with real-time package tracking.', 'Mensajería exprés con rastreo de paquetes en tiempo real.'],
  ['TechServe Pro', 'https://techserve-pro.vercel.app', 'business', 'IT services and remote tech support plans.', 'Servicios de TI y planes de soporte técnico remoto.'],
  ['E-Waste Recycling', 'https://e-waste-recycling.vercel.app', 'business', 'Electronics recycling with pickup scheduling.', 'Reciclaje de electrónicos con programación de recogidas.'],

  ['OfferBound', 'https://offerbound-portal.vercel.app', 'realestate', 'Real estate offer management with workflow automation.', 'Gestión de ofertas inmobiliarias con automatización de flujos de trabajo.'],
  ['NestKey', 'https://nestkey-nu.vercel.app', 'realestate', 'Real estate listings, search and agent profiles.', 'Listados inmobiliarios, búsqueda y perfiles de agentes.'],
  ['Property Hub', 'https://property.amsitservices.com', 'realestate', 'Property management with listings and tenant portal.', 'Administración de propiedades con listados y portal para inquilinos.'],

  ['Glow Mobile Spa', 'https://glowmobile-spa.vercel.app', 'wellness', 'Mobile spa and wellness with treatments and booking.', 'Spa móvil y bienestar con tratamientos y reservas.'],
  ['Mobile Spa', 'https://mobile-spa.vercel.app', 'wellness', 'Luxury at-home spa treatments and packages.', 'Tratamientos de spa de lujo a domicilio y paquetes.'],
  ['Mindful Hypnotherapy', 'https://hypnotherapy-sandy.vercel.app', 'wellness', 'Hypnotherapy sessions and wellness blog.', 'Sesiones de hipnoterapia y blog de bienestar.'],
  ['Care Connect', 'https://care-connect.vercel.app', 'wellness', 'Platform connecting patients with healthcare providers.', 'Plataforma que conecta pacientes con proveedores de salud.'],
  ['FitPro Training', 'https://fit-pro.vercel.app', 'wellness', 'Personal training and fitness coaching.', 'Entrenamiento personal y coaching de fitness.'],
  ['Style By You', 'https://personal-styling.vercel.app', 'wellness', 'Personal styling and fashion consulting.', 'Asesoría de imagen personal y moda.'],

  ['Music Lessons', 'https://music-lessons.vercel.app', 'education', 'Music academy with lessons, instructors and scheduling.', 'Academia de música con clases, instructores y horarios.'],
  ['Harmony Road Music', 'https://harmony-road-music.vercel.app', 'education', 'Music school with instructor profiles and scheduling.', 'Escuela de música con perfiles de instructores y agenda.'],
  ['Art Classes Studio', 'https://art-classes.vercel.app', 'education', 'Art studio with class catalog and registration.', 'Estudio de arte con catálogo de clases e inscripción.'],
  ['Canine Coach', 'https://dog-training.vercel.app', 'education', 'Dog training programs and booking.', 'Programas de adiestramiento canino y reservas.'],

  ['Lens & Light Media', 'https://lens-light-media.vercel.app', 'creative', 'Photography and videography portfolio.', 'Portafolio de fotografía y videografía.'],
  ['Drone Photography', 'https://drone-photography-sigma.vercel.app', 'creative', 'Aerial photography and videography with booking.', 'Fotografía y video aéreo con reservas.'],
  ['Graphic Design Pro', 'https://graphic-design.vercel.app', 'creative', 'Graphic design services with portfolio and packages.', 'Servicios de diseño gráfico con portafolio y paquetes.'],
  ['VocalCraft Voiceover', 'https://vocalcraft-voiceover.vercel.app', 'creative', 'Voiceover and audio production studio.', 'Estudio de locución y producción de audio.'],
  ['PrintLayer 3D Studio', 'https://printlayer-3d-studio.vercel.app', 'creative', '3D printing with custom orders and catalog.', 'Impresión 3D con pedidos personalizados y catálogo.'],
  ['Laser Engraving', 'https://laser-engraving.vercel.app', 'creative', 'Custom laser engraving with design tools and ordering.', 'Grabado láser personalizado con herramientas de diseño y pedidos.'],

  ['Wedding Event Pro', 'https://wedding-event-planning.vercel.app', 'events', 'Wedding planning with a curated vendor network.', 'Planificación de bodas con red de proveedores seleccionados.'],
  ['EverAfter Wedding', 'https://everafter-wedding.vercel.app', 'events', 'Full-service wedding planning and styling.', 'Planificación y estilismo integral de bodas.'],
  ['Escape Room', 'https://escape-room.vercel.app', 'events', 'Escape room venue with themed rooms and booking.', 'Sala de escape con salas temáticas y reservas.'],

  ['AutoPro Detailing', 'https://auto-pro-detailing.vercel.app', 'automotive', 'Auto detailing with service packages and booking.', 'Detallado automotriz con paquetes de servicio y reservas.'],
  ['Vehicle Wraps Pro', 'https://vehicle-wraps.vercel.app', 'automotive', 'Custom vehicle wrap design and installation.', 'Diseño e instalación de rotulación vehicular personalizada.'],
  ['RV Repair Pro', 'https://rv-repair-pearl.vercel.app', 'automotive', 'RV and camper repair with a mobile service fleet.', 'Reparación de RV y campers con flota de servicio móvil.'],
  ['Mobile Bike Repair', 'https://mobile-bike-repair.vercel.app', 'automotive', 'On-site bicycle repair and maintenance.', 'Reparación y mantenimiento de bicicletas a domicilio.'],

  ['Mufasa Jeweler', 'https://mufasa-jeweler.vercel.app', 'ecommerce', 'Luxury jewelry e-commerce store with cart.', 'Tienda en línea de joyería de lujo con carrito.'],
  ['IntelliSyncs', 'https://intellisyncs-web.vercel.app', 'ecommerce', 'SaaS platform with pricing and technical documentation.', 'Plataforma SaaS con precios y documentación técnica.'],
  ['AMS E-Commerce', 'https://wise-ams-ecommerce.vercel.app', 'ecommerce', 'E-commerce platform with full admin dashboard.', 'Plataforma de comercio electrónico con panel de administración completo.'],
];

// Shown on the home page (by URL).
export const featuredApps = [
  'https://intellisyncs-web.amsitservices.com',
  'https://claimright-medical-billing.amsitservices.com',
  'https://mss-steel-tubes.amsitservices.com',
  'https://wealthpath-financial-advisors.amsitservices.com',
  'https://divedeep-scuba-school.amsitservices.com',
  'https://memphis-indian-restaurant.amsitservices.com',
];

export const designs = ['Volt Electronics', 'Luxe Threads', 'Pet Pulse', 'Artisanal Attic', 'Hike & Peak', 'Retro Grooves',
  'Ink & Paper', 'Sole Search', 'Zen Den', 'Sprout & Seed', 'Bloom Box'];

export const posts = [
  {
    slug: 'top-cybersecurity-threats-facing-small-businesses',
    cover: 'cybersecurity',
    published_at: '2026-07-19',
    title_en: 'Top Cybersecurity Threats Facing Small Businesses',
    title_es: 'Principales amenazas de ciberseguridad para pequeñas empresas',
    excerpt_en: 'Phishing, ransomware and weak passwords still cause most breaches. Here is how small teams can defend themselves without an enterprise budget.',
    excerpt_es: 'El phishing, el ransomware y las contraseñas débiles siguen causando la mayoría de las brechas. Así pueden defenderse los equipos pequeños sin un presupuesto empresarial.',
    body_en: `Small businesses are now the most common target of cyberattacks — not because they hold the most valuable data, but because they are usually the easiest to break into.

## 1. Phishing and business email compromise
Most incidents still start with an email. Attackers impersonate vendors, banks or even your own leadership to trick staff into sending money or credentials.
**What to do:** turn on multi-factor authentication everywhere, train your team to verify payment changes by phone, and use a mail provider with strong filtering.

## 2. Ransomware
Ransomware encrypts your files and demands payment. Small businesses often pay because they have no clean backup.
**What to do:** keep automatic, versioned, offline backups and test restoring them every quarter.

## 3. Weak and reused passwords
A single leaked password can unlock email, banking and your website admin.
**What to do:** adopt a password manager and enforce unique passwords for every system.

## 4. Unpatched websites and plugins
Outdated CMS plugins are one of the most common entry points we see.
**What to do:** schedule monthly updates, remove unused plugins and put your site behind a web application firewall.

Security does not have to be expensive. The AMS IT Services team can audit your website, email and cloud setup and give you a clear, prioritized plan.`,
    body_es: `Las pequeñas empresas son hoy el objetivo más común de los ciberataques, no porque tengan los datos más valiosos, sino porque suelen ser las más fáciles de vulnerar.

## 1. Phishing y suplantación de correo empresarial
La mayoría de los incidentes comienzan con un correo. Los atacantes se hacen pasar por proveedores, bancos o la propia dirección para engañar al personal.
**Qué hacer:** active la autenticación multifactor en todo, capacite a su equipo para verificar por teléfono cualquier cambio de pago y use un proveedor de correo con filtrado sólido.

## 2. Ransomware
El ransomware cifra sus archivos y exige un pago. Muchas pequeñas empresas pagan porque no tienen una copia de seguridad limpia.
**Qué hacer:** mantenga copias automáticas, versionadas y fuera de línea, y pruebe restaurarlas cada trimestre.

## 3. Contraseñas débiles y reutilizadas
Una sola contraseña filtrada puede abrir el correo, la banca y el administrador del sitio web.
**Qué hacer:** use un gestor de contraseñas y exija contraseñas únicas para cada sistema.

## 4. Sitios y plugins sin actualizar
Los plugins desactualizados son una de las puertas de entrada más comunes.
**Qué hacer:** programe actualizaciones mensuales, elimine plugins sin uso y proteja su sitio con un firewall de aplicaciones web.

La seguridad no tiene que ser costosa. El equipo de AMS IT Services puede auditar su sitio, correo y nube y entregarle un plan claro y priorizado.`,
  },
  {
    slug: 'how-ai-is-reshaping-web-development',
    cover: 'ai-web',
    published_at: '2026-07-19',
    title_en: 'How AI Is Reshaping Web Development',
    title_es: 'Cómo la IA está transformando el desarrollo web',
    excerpt_en: 'From AI-assisted coding to personalized user experiences, artificial intelligence is changing how websites are built, tested and run.',
    excerpt_es: 'Desde la programación asistida por IA hasta experiencias personalizadas, la inteligencia artificial está cambiando cómo se construyen, prueban y operan los sitios web.',
    body_en: `Artificial intelligence has moved from a buzzword to an everyday tool in our development workflow. Here is what has actually changed.

## Faster delivery with AI-assisted coding
AI pair programmers draft boilerplate, write tests and suggest refactors. Our engineers spend more time on architecture and user experience and less on repetitive code — which means faster launches for clients.

## Smarter, personalized experiences
Websites can now adapt content, product recommendations and search results to each visitor in real time.

## Automated quality assurance
AI-driven testing tools detect visual regressions, broken flows and accessibility issues before customers ever see them.

## Conversational interfaces
Chat assistants trained on your own content answer customer questions 24/7 and hand off qualified leads to your team.

## What stays human
Strategy, brand, and judgment. AI accelerates the work, but understanding your customers and your business goals is still where great websites begin.

Curious how AI could fit into your next project? Talk to the AMS IT Services team.`,
    body_es: `La inteligencia artificial pasó de ser una palabra de moda a una herramienta diaria en nuestro flujo de desarrollo. Esto es lo que realmente ha cambiado.

## Entregas más rápidas con programación asistida por IA
Los asistentes de IA redactan código repetitivo, escriben pruebas y sugieren mejoras. Nuestros ingenieros dedican más tiempo a la arquitectura y la experiencia de usuario, lo que significa lanzamientos más rápidos.

## Experiencias más inteligentes y personalizadas
Los sitios web ahora pueden adaptar contenido, recomendaciones y resultados de búsqueda a cada visitante en tiempo real.

## Control de calidad automatizado
Las herramientas de prueba con IA detectan regresiones visuales, flujos rotos y problemas de accesibilidad antes de que los vean los clientes.

## Interfaces conversacionales
Asistentes de chat entrenados con su propio contenido responden preguntas 24/7 y entregan prospectos calificados a su equipo.

## Lo que sigue siendo humano
La estrategia, la marca y el criterio. La IA acelera el trabajo, pero entender a sus clientes y objetivos sigue siendo el punto de partida de un gran sitio web.

¿Quiere saber cómo la IA puede encajar en su próximo proyecto? Hable con el equipo de AMS IT Services.`,
  },
  {
    slug: 'digital-transformation-a-practical-roadmap',
    cover: 'digital-transformation',
    published_at: '2026-07-18',
    title_en: 'Digital Transformation: A Practical Roadmap',
    title_es: 'Transformación digital: una hoja de ruta práctica',
    excerpt_en: 'Digital transformation is not one big project. It is a series of small, measurable steps. Here is the roadmap we use with our clients.',
    excerpt_es: 'La transformación digital no es un gran proyecto, sino una serie de pasos pequeños y medibles. Esta es la hoja de ruta que usamos con nuestros clientes.',
    body_en: `"Digital transformation" sounds overwhelming. In practice, it is a sequence of focused improvements that each pay for themselves.

## Step 1 — Audit what you have
List your tools, data and manual processes. Find where time and money leak: double data entry, paper forms, spreadsheets emailed back and forth.

## Step 2 — Fix the foundation
A fast, secure, mobile-friendly website and reliable cloud hosting are the base everything else is built on.

## Step 3 — Automate one workflow
Pick the most painful manual process — quotes, bookings, invoicing — and automate it end to end. Measure the hours saved.

## Step 4 — Connect your systems
Use APIs to connect your website, CRM, accounting and email so data flows automatically.

## Step 5 — Use your data
With clean, connected data you can build dashboards and make decisions on facts instead of guesses.

## Step 6 — Repeat
Transformation is continuous. Each quarter, pick the next bottleneck and improve it.

AMS IT Services offers a free business strategy consultation with every project — a great place to start your roadmap.`,
    body_es: `"Transformación digital" suena abrumador. En la práctica, es una secuencia de mejoras enfocadas que se pagan por sí mismas.

## Paso 1 — Audite lo que tiene
Enumere sus herramientas, datos y procesos manuales. Encuentre dónde se pierden tiempo y dinero.

## Paso 2 — Refuerce la base
Un sitio web rápido, seguro y adaptado a móviles, y un hosting confiable en la nube, son la base de todo lo demás.

## Paso 3 — Automatice un flujo de trabajo
Elija el proceso manual más doloroso — cotizaciones, reservas, facturación — y automatícelo de principio a fin.

## Paso 4 — Conecte sus sistemas
Use APIs para conectar su sitio web, CRM, contabilidad y correo para que los datos fluyan automáticamente.

## Paso 5 — Aproveche sus datos
Con datos limpios y conectados puede crear paneles y tomar decisiones basadas en hechos.

## Paso 6 — Repita
La transformación es continua. Cada trimestre, elija el siguiente cuello de botella y mejórelo.

AMS IT Services ofrece una consulta gratuita de estrategia empresarial con cada proyecto: un excelente punto de partida.`,
  },
];
