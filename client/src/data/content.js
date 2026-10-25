// Bilingual site content taken from amsitservices.com and dockpass.org.

export const company = {
  name: 'AMS IT Services',
  email: 'mudassir@amsitservices.com',
  phone: '+1 (901) 415-0779',
  phoneHref: 'tel:+19014150779',
  offices: [
    { key: 'usa', city: 'Memphis, Tennessee, USA', flag: '🇺🇸' },
    { key: 'india', city: 'Hyderabad, Telangana, India', flag: '🇮🇳' },
  ],
};

export const stats = [
  { value: 185, suffix: '+', key: 'websites' },
  { value: 235, suffix: '+', key: 'ecommerce' },
  { value: 21, suffix: '+', key: 'apps' },
  { value: 8, suffix: '+', key: 'years' },
  { value: 50, suffix: '+', key: 'team' },
  { value: 1200, suffix: '+', key: 'clients' },
];

export const techLogos = [
  'wordpress.svg', 'shopify.svg', 'Amazon_Web_Services-Logo.wine.svg', 'docker.jpeg', 'n8n.svg', 'javascript.webp',
  'html.svg', 'css.png', 'wix.png', 'Squarespace.png', 'Hostinger_Logo.png', 'Godaddy-logo.png', 'Amazon_logo.svg.png',
  'openclaw.webp', 'antigravity.png',
];

export const categories = [
  { key: 'home', en: 'Home Services', es: 'Servicios del hogar' },
  { key: 'wellness', en: 'Health & Wellness', es: 'Salud y bienestar' },
  { key: 'business', en: 'Professional Services', es: 'Servicios profesionales' },
  { key: 'apps', en: 'Web Apps & Tools', es: 'Apps web y herramientas' },
  { key: 'outdoor', en: 'Sports & Outdoors', es: 'Deportes y aire libre' },
  { key: 'industrial', en: 'Industrial & Engineering', es: 'Industria e ingeniería' },
  { key: 'creative', en: 'Media & Creative', es: 'Medios y creatividad' },
  { key: 'pets', en: 'Pets & Animals', es: 'Mascotas y animales' },
  { key: 'food', en: 'Food & Hospitality', es: 'Gastronomía' },
  { key: 'finance', en: 'Finance & Insurance', es: 'Finanzas y seguros' },
  { key: 'ecommerce', en: 'E-commerce & Retail', es: 'E-commerce y retail' },
  { key: 'realestate', en: 'Real Estate & Hospitality', es: 'Bienes raíces y hotelería' },
  { key: 'automotive', en: 'Automotive & Marine', es: 'Automotriz y náutica' },
  { key: 'events', en: 'Events & Entertainment', es: 'Eventos y entretenimiento' },
  { key: 'education', en: 'Education & Classes', es: 'Educación y clases' },
];
export const categoryLabel = (key, lang) => categories.find((c) => c.key === key)?.[lang] || key;

const f = (en, es) => ({ en, es });

export const services = [
  {
    slug: 'custom-web-development', icon: 'Code2', core: true,
    title: f('Custom Web Development', 'Desarrollo web a medida'),
    short: f('Tailored web solutions built around your business goals — no templates.', 'Soluciones web a medida construidas en torno a sus objetivos, sin plantillas.'),
    intro: f('We don’t use templates. We build bespoke digital experiences that reflect your brand identity and drive measurable results.', 'No usamos plantillas. Creamos experiencias digitales a medida que reflejan su marca y generan resultados medibles.'),
    features: [
      f('Bespoke web applications tailored to your business logic', 'Aplicaciones web a medida para la lógica de su negocio'),
      f('Dynamic platforms built for scalability and engagement', 'Plataformas dinámicas pensadas para escalar y atraer'),
      f('API integrations with the third-party services you rely on', 'Integraciones API con los servicios de terceros que usa'),
      f('Cloud deployment on AWS, Vercel and other leading platforms', 'Despliegue en la nube en AWS, Vercel y otras plataformas'),
    ],
  },
  {
    slug: 'e-commerce-solutions', icon: 'ShoppingBag', core: true,
    title: f('E-commerce Solutions', 'Soluciones de e-commerce'),
    short: f('Scalable, secure online stores on Shopify, WooCommerce or fully custom platforms.', 'Tiendas en línea escalables y seguras en Shopify, WooCommerce o plataformas a medida.'),
    intro: f('From product catalog to checkout, we build stores that convert visitors into loyal customers — 235+ stores launched and counting.', 'Del catálogo al pago, creamos tiendas que convierten visitantes en clientes leales: más de 235 tiendas lanzadas.'),
    features: [
      f('Shopify, WooCommerce and headless commerce builds', 'Tiendas en Shopify, WooCommerce y comercio headless'),
      f('Secure payments, shipping and tax configuration', 'Pagos seguros, envíos e impuestos configurados'),
      f('Inventory, order and customer management dashboards', 'Paneles de inventario, pedidos y clientes'),
      f('Conversion-focused product pages and checkout', 'Páginas de producto y checkout orientados a la conversión'),
    ],
  },
  {
    slug: 'web-app-development', icon: 'LayoutDashboard', core: true,
    title: f('Web App Development', 'Desarrollo de aplicaciones web'),
    short: f('Interactive, data-driven web applications built with modern frameworks.', 'Aplicaciones web interactivas y basadas en datos con frameworks modernos.'),
    intro: f('Portals, dashboards and SaaS platforms engineered with React, Next.js and Node.js — fast, secure and built to scale.', 'Portales, paneles y plataformas SaaS con React, Next.js y Node.js: rápidos, seguros y escalables.'),
    features: [
      f('SaaS platforms with subscriptions and role-based access', 'Plataformas SaaS con suscripciones y acceso por roles'),
      f('Customer and staff portals with real-time data', 'Portales para clientes y personal con datos en tiempo real'),
      f('Workflow automation that replaces spreadsheets', 'Automatización de flujos que reemplaza hojas de cálculo'),
      f('Analytics dashboards and reporting', 'Paneles de análisis e informes'),
    ],
  },
  {
    slug: 'mobile-app-development', icon: 'Smartphone', core: true,
    title: f('Mobile App Development', 'Desarrollo de apps móviles'),
    short: f('Native and cross-platform iOS and Android apps your customers love.', 'Apps nativas y multiplataforma para iOS y Android que sus clientes amarán.'),
    intro: f('We design, build and launch mobile apps that feel fast and intuitive — from MVP to App Store and Google Play.', 'Diseñamos, desarrollamos y lanzamos apps móviles rápidas e intuitivas, del MVP a App Store y Google Play.'),
    features: [
      f('Cross-platform apps with React Native and Flutter', 'Apps multiplataforma con React Native y Flutter'),
      f('Native iOS and Android development', 'Desarrollo nativo para iOS y Android'),
      f('Push notifications, payments and offline support', 'Notificaciones push, pagos y modo sin conexión'),
      f('App Store and Google Play publishing', 'Publicación en App Store y Google Play'),
    ],
  },
  {
    slug: 'mobile-app-design', icon: 'PenTool', core: true,
    title: f('Mobile App Design', 'Diseño de apps móviles'),
    short: f('UI/UX design that makes your app intuitive, beautiful and on-brand.', 'Diseño UI/UX que hace su app intuitiva, atractiva y fiel a su marca.'),
    intro: f('Research-driven UX and pixel-perfect UI, delivered as interactive prototypes your developers can build from day one.', 'UX basada en investigación y UI impecable, entregadas como prototipos interactivos listos para desarrollo.'),
    features: [
      f('User research, journeys and wireframes', 'Investigación de usuarios, recorridos y wireframes'),
      f('High-fidelity UI and design systems', 'UI de alta fidelidad y sistemas de diseño'),
      f('Clickable prototypes and usability testing', 'Prototipos navegables y pruebas de usabilidad'),
      f('Developer-ready handoff in Figma', 'Entrega lista para desarrollo en Figma'),
    ],
  },
  {
    slug: 'aws-cloud', icon: 'Cloud', core: true,
    title: f('AWS Cloud Integration', 'Integración en la nube AWS'),
    short: f('Secure, scalable cloud infrastructure on Amazon Web Services.', 'Infraestructura en la nube segura y escalable en Amazon Web Services.'),
    intro: f('We migrate, architect and manage cloud infrastructure so your applications stay fast, secure and cost-efficient.', 'Migramos, diseñamos y gestionamos infraestructura en la nube para que sus aplicaciones sean rápidas, seguras y eficientes.'),
    features: [
      f('Cloud architecture and migration', 'Arquitectura y migración a la nube'),
      f('Serverless and containerized deployments (Docker)', 'Despliegues serverless y en contenedores (Docker)'),
      f('Monitoring, backups and disaster recovery', 'Monitoreo, copias de seguridad y recuperación'),
      f('Cost optimization and security hardening', 'Optimización de costos y refuerzo de seguridad'),
    ],
  },
  {
    slug: 'seo-optimization', icon: 'Search', core: false,
    title: f('SEO Optimization', 'Optimización SEO'),
    short: f('Rank higher on Google and turn search traffic into customers.', 'Posiciónese mejor en Google y convierta el tráfico en clientes.'),
    intro: f('Technical SEO, content strategy and local search optimization that compound month after month.', 'SEO técnico, estrategia de contenido y SEO local que crecen mes a mes.'),
    features: [
      f('Technical SEO audits and Core Web Vitals', 'Auditorías SEO técnicas y Core Web Vitals'),
      f('Keyword research and on-page optimization', 'Investigación de palabras clave y optimización on-page'),
      f('Local SEO and Google Business Profile', 'SEO local y perfil de Google Business'),
      f('Monthly ranking and traffic reports', 'Informes mensuales de posicionamiento y tráfico'),
    ],
  },
  {
    slug: 'digital-marketing', icon: 'Megaphone', core: false,
    title: f('Digital Marketing', 'Marketing digital'),
    short: f('Campaigns across search and social that bring measurable growth.', 'Campañas en buscadores y redes sociales con crecimiento medible.'),
    intro: f('Data-driven campaigns on Google, Meta and LinkedIn — planned, launched and optimized for real return on ad spend.', 'Campañas basadas en datos en Google, Meta y LinkedIn, optimizadas para un retorno real.'),
    features: [
      f('Google Ads and paid social campaigns', 'Google Ads y campañas pagadas en redes'),
      f('Social media strategy and management', 'Estrategia y gestión de redes sociales'),
      f('Email marketing and automation', 'Email marketing y automatización'),
      f('Analytics, tracking and conversion optimization', 'Analítica, seguimiento y optimización de conversiones'),
    ],
  },
  {
    slug: 'crm', icon: 'Users', core: false,
    title: f('CRM Development', 'Desarrollo de CRM'),
    short: f('Custom CRM systems that keep every lead and customer organized.', 'Sistemas CRM a medida que organizan cada prospecto y cliente.'),
    intro: f('Purpose-built CRMs and integrations that match how your team actually sells and serves customers.', 'CRM a medida e integraciones que se ajustan a cómo su equipo realmente vende y atiende.'),
    features: [
      f('Custom pipelines, contacts and deal tracking', 'Embudos, contactos y seguimiento de oportunidades'),
      f('Integrations with email, forms and accounting', 'Integraciones con correo, formularios y contabilidad'),
      f('Automated follow-ups and reminders', 'Seguimientos y recordatorios automáticos'),
      f('Sales dashboards and reporting', 'Paneles e informes de ventas'),
    ],
  },
  {
    slug: 'api-development', icon: 'Plug', core: false,
    title: f('API Development', 'Desarrollo de APIs'),
    short: f('Robust REST APIs and integrations that connect your systems.', 'APIs REST robustas e integraciones que conectan sus sistemas.'),
    intro: f('Secure, documented APIs and third-party integrations that let your apps and tools share data automatically.', 'APIs seguras y documentadas e integraciones que permiten a sus herramientas compartir datos automáticamente.'),
    features: [
      f('REST and webhook API design', 'Diseño de APIs REST y webhooks'),
      f('Payment, shipping and messaging integrations', 'Integraciones de pagos, envíos y mensajería'),
      f('Authentication, rate limiting and security', 'Autenticación, límites de uso y seguridad'),
      f('Clear documentation for your developers', 'Documentación clara para sus desarrolladores'),
    ],
  },
  {
    slug: 'custom-database', icon: 'Database', core: false,
    title: f('Custom Database Solutions', 'Soluciones de bases de datos'),
    short: f('Reliable data models, migrations and reporting for your business.', 'Modelos de datos confiables, migraciones e informes para su negocio.'),
    intro: f('We design, migrate and optimize databases so your data stays accurate, fast and secure.', 'Diseñamos, migramos y optimizamos bases de datos para que sus datos sean precisos, rápidos y seguros.'),
    features: [
      f('Schema design for SQL and NoSQL databases', 'Diseño de esquemas SQL y NoSQL'),
      f('Data migration from spreadsheets and legacy systems', 'Migración desde hojas de cálculo y sistemas antiguos'),
      f('Performance tuning and backups', 'Optimización de rendimiento y respaldos'),
      f('Reporting and business intelligence', 'Informes e inteligencia de negocio'),
    ],
  },
  {
    slug: 'software-testing', icon: 'ShieldCheck', core: false,
    title: f('Software Testing', 'Pruebas de software'),
    short: f('Manual and automated QA so every release ships with confidence.', 'QA manual y automatizado para lanzar cada versión con confianza.'),
    intro: f('Functional, performance and security testing that catches issues before your customers do.', 'Pruebas funcionales, de rendimiento y seguridad que detectan problemas antes que sus clientes.'),
    features: [
      f('Automated end-to-end and regression testing', 'Pruebas automatizadas end-to-end y de regresión'),
      f('Cross-browser and mobile device testing', 'Pruebas en navegadores y dispositivos móviles'),
      f('Performance and load testing', 'Pruebas de rendimiento y carga'),
      f('Security and accessibility reviews', 'Revisiones de seguridad y accesibilidad'),
    ],
  },
  {
    slug: 'content-writing', icon: 'FileText', core: false,
    title: f('Content Writing', 'Redacción de contenido'),
    short: f('Clear, persuasive copy that speaks to your customers.', 'Textos claros y persuasivos que conectan con sus clientes.'),
    intro: f('Professional writers who turn your expertise into content that ranks, informs and converts.', 'Redactores profesionales que convierten su experiencia en contenido que posiciona, informa y convierte.'),
    features: [
      f('Website and landing page copy', 'Textos para sitios web y landing pages'),
      f('SEO-optimized long-form content', 'Contenido extenso optimizado para SEO'),
      f('Brand voice and messaging guides', 'Guías de voz y mensajes de marca'),
      f('Editing and proofreading', 'Edición y corrección'),
    ],
  },
  {
    slug: 'web-content', icon: 'Layers', core: false,
    title: f('Web Content', 'Contenido web'),
    short: f('Structured, engaging page content for every section of your site.', 'Contenido estructurado y atractivo para cada sección de su sitio.'),
    intro: f('We plan and produce the content architecture of your website — from navigation to every headline.', 'Planificamos y producimos la arquitectura de contenido de su sitio, desde la navegación hasta cada titular.'),
    features: [
      f('Content strategy and site maps', 'Estrategia de contenido y mapas del sitio'),
      f('Service, product and about pages', 'Páginas de servicios, productos y nosotros'),
      f('Microcopy for forms and calls to action', 'Microtextos para formularios y llamadas a la acción'),
      f('Multilingual content (English & Spanish)', 'Contenido multilingüe (inglés y español)'),
    ],
  },
  {
    slug: 'articles', icon: 'Newspaper', core: false,
    title: f('Articles', 'Artículos'),
    short: f('Researched articles that position you as an industry authority.', 'Artículos investigados que lo posicionan como autoridad del sector.'),
    intro: f('In-depth, well-researched articles for your website, LinkedIn and industry publications.', 'Artículos profundos y bien investigados para su sitio, LinkedIn y publicaciones del sector.'),
    features: [
      f('Thought leadership and industry insights', 'Liderazgo de opinión y análisis del sector'),
      f('How-to guides and case studies', 'Guías prácticas y casos de estudio'),
      f('Research, sourcing and fact-checking', 'Investigación, fuentes y verificación'),
      f('SEO metadata and internal linking', 'Metadatos SEO y enlaces internos'),
    ],
  },
  {
    slug: 'blog-posts', icon: 'PenLine', core: false,
    title: f('Blog Posts', 'Publicaciones de blog'),
    short: f('Consistent, high-quality blog content that grows organic traffic.', 'Contenido de blog constante y de calidad que aumenta el tráfico orgánico.'),
    intro: f('A reliable publishing calendar of blog posts tailored to your audience and search intent.', 'Un calendario editorial confiable de publicaciones adaptadas a su audiencia y a la intención de búsqueda.'),
    features: [
      f('Editorial calendar and topic research', 'Calendario editorial e investigación de temas'),
      f('SEO-optimized blog posts', 'Publicaciones de blog optimizadas para SEO'),
      f('Images, formatting and publishing', 'Imágenes, formato y publicación'),
      f('Performance tracking and refreshes', 'Seguimiento de rendimiento y actualizaciones'),
    ],
  },
];

export const dockpass = {
  url: 'https://dockpass.org',
  registerUrl: 'https://dockpass.org/register',
  demoUrl: 'https://dockpass.org/contact',
  tagline: f('Pickup verification for warehouses', 'Verificación de recogidas para almacenes'),
  headline: f('Know exactly who drives away with your freight.', 'Sepa exactamente quién se lleva su carga.'),
  summary: f(
    'DockPass checks every driver live against a government ID, issues a single-use QR pass, and makes security, loading and approval agree before a truck leaves the dock.',
    'DockPass verifica a cada conductor en vivo con su identificación oficial, emite un pase QR de un solo uso y alinea seguridad, carga y aprobación antes de que un camión salga del muelle.'
  ),
  highlights: [f('No hardware required', 'Sin hardware'), f('No app for drivers', 'Sin app para conductores'), f('Live in 15 minutes', 'Activo en 15 minutos')],
  problems: [
    { icon: 'UserX', title: f('Fictitious pickups', 'Recogidas ficticias'), text: f('Thieves pose as legitimate carriers with forged paperwork.', 'Ladrones se hacen pasar por transportistas legítimos con documentos falsos.') },
    { icon: 'FileWarning', title: f('Unverifiable paper', 'Papeles imposibles de verificar'), text: f('Bills of lading and clipboard names don’t prove who is driving.', 'Los conocimientos de embarque y las listas no prueban quién conduce.') },
    { icon: 'History', title: f('No audit trail', 'Sin registro de auditoría'), text: f('When a load disappears, there’s no record of who checked what, and when.', 'Cuando desaparece una carga, no hay registro de quién verificó qué ni cuándo.') },
  ],
  steps: [
    { title: f('Create the shipment', 'Cree el envío'), text: f('Your team creates the pickup and assigns the carrier.', 'Su equipo crea la recogida y asigna al transportista.') },
    { title: f('Driver verifies ID', 'El conductor verifica su ID'), text: f('Live license check plus selfie face match — in the browser, no app.', 'Verificación de licencia en vivo y selfie, desde el navegador, sin app.') },
    { title: f('Single-use pass issued', 'Se emite un pase único'), text: f('A QR credential valid for one warehouse, one shipment, one time.', 'Una credencial QR válida para un almacén, un envío y un solo uso.') },
    { title: f('Three checkpoints agree', 'Tres controles coinciden'), text: f('Security gate, loading dock and final approval must all match.', 'La puerta de seguridad, el muelle de carga y la aprobación final deben coincidir.') },
  ],
  features: [
    { icon: 'ScanFace', title: f('Live ID & face match', 'ID y rostro en vivo'), text: f('License authenticity and a live selfie are checked before any credential is created.', 'Se verifica la autenticidad de la licencia y una selfie en vivo antes de crear cualquier credencial.') },
    { icon: 'QrCode', title: f('Single-use QR credentials', 'Credenciales QR de un solo uso'), text: f('Each code works once, at one warehouse, for one shipment. Duplicate scans fail.', 'Cada código funciona una vez, en un almacén y para un envío. Los escaneos duplicados fallan.') },
    { icon: 'ScrollText', title: f('Complete audit trail', 'Auditoría completa'), text: f('Every scan, check and decision is logged with who, where and when.', 'Cada escaneo, verificación y decisión queda registrado con quién, dónde y cuándo.') },
    { icon: 'ScanLine', title: f('Gate scanning, no hardware', 'Escaneo en puerta sin hardware'), text: f('Guards scan with any phone camera. Denied scans alert your team instantly.', 'Los guardias escanean con cualquier teléfono. Los rechazos alertan al equipo al instante.') },
  ],
  industries: [
    f('3PL warehouses', 'Almacenes 3PL'), f('Food & beverage', 'Alimentos y bebidas'), f('Electronics', 'Electrónica'),
    f('Pharma', 'Farmacéutica'), f('Retail distribution', 'Distribución minorista'), f('Cold chain', 'Cadena de frío'),
  ],
};
