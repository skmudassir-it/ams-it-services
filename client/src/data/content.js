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

// Flagship product: AMS ERP (amserp.org).
export const amserp = {
  url: 'https://amserp.org',
  loginUrl: 'https://amserp.org/login',
  tagline: f('Enterprise suite — one database, every process', 'Suite empresarial: una base de datos, todos los procesos'),
  eyebrow: f('One database · every process · posted in real time', 'Una base de datos · todos los procesos · contabilizado en tiempo real'),
  headline: f('Run the whole business on one system.', 'Gestione toda la empresa en un solo sistema.'),
  summary: f(
    'AMS ERP brings purchasing, sales, CRM, production, quality, maintenance, warehouse, shipping, finance, controlling and HR into a single web application. Every goods movement, invoice, expense claim and payroll run posts straight to the ledger.',
    'AMS ERP une compras, ventas, CRM, producción, calidad, mantenimiento, almacén, envíos, finanzas, controlling y RR. HH. en una sola aplicación web. Cada movimiento de mercancía, factura, gasto y nómina se contabiliza directamente en el libro mayor.'
  ),
  stats: [
    { value: '12', label: f('integrated modules', 'módulos integrados') },
    { value: '200+', label: f('screens and reports', 'pantallas e informes') },
    { value: '0.00', label: f('trial balance, always', 'balance de comprobación, siempre') },
    { value: '100%', label: f('changes audited', 'cambios auditados') },
  ],
  highlights: [f('SAP-style T-codes', 'T-codes estilo SAP'), f('SSO & 2FA', 'SSO y 2FA'), f('Runs on your server', 'En su propio servidor')],
  modules: [
    { code: 'MM', icon: 'Package', name: f('Materials management', 'Gestión de materiales'), items: [
      f('Requisitions, RFQs and release-controlled purchase orders', 'Solicitudes, RFQ y órdenes de compra con liberación'),
      f('Goods receipts with batches and serial numbers', 'Recepciones con lotes y números de serie'),
      f('Three-way-match invoice verification', 'Verificación de facturas con conciliación a tres vías')] },
    { code: 'SD', icon: 'ShoppingCart', name: f('Sales & distribution', 'Ventas y distribución'), items: [
      f('Quotations, orders, returns and back orders', 'Cotizaciones, pedidos, devoluciones y pedidos pendientes'),
      f('Pricing conditions, credit and availability checks', 'Condiciones de precio, crédito y disponibilidad'),
      f('Deliveries, billing and credit memos', 'Entregas, facturación y notas de crédito')] },
    { code: 'PP', icon: 'Factory', name: f('Production', 'Producción'), items: [
      f('Bills of materials and routings', 'Listas de materiales y hojas de ruta'),
      f('Production orders with component issue', 'Órdenes de producción con salida de componentes'),
      f('Material requirements planning (MRP)', 'Planificación de necesidades de material (MRP)')] },
    { code: 'QM', icon: 'ClipboardCheck', name: f('Quality', 'Calidad'), items: [
      f('Inspection lots at goods receipt', 'Lotes de inspección en la recepción'),
      f('Quality hold until usage decision', 'Bloqueo de calidad hasta la decisión de empleo'),
      f('Defect recording per lot', 'Registro de defectos por lote')] },
    { code: 'WMS', icon: 'Warehouse', name: f('Warehouse', 'Almacén'), items: [
      f('Batch-level bin stock, putaway and FEFO picking', 'Stock por ubicación y lote, ubicación y picking FEFO'),
      f('Pick waves, packing with SSCC labels', 'Oleadas de picking y embalaje con etiquetas SSCC'),
      f('Replenishment and ABC cycle counting', 'Reposición e inventario cíclico ABC')] },
    { code: 'SHP', icon: 'Truck', name: f('Shipping', 'Envíos'), items: [
      f('Load planning, zone and weight-break rates', 'Planificación de cargas y tarifas por zona y peso'),
      f('BOL, labels, tracking and customer alerts', 'BOL, etiquetas, seguimiento y avisos al cliente'),
      f('Freight accrual, carrier invoice settlement', 'Provisión de fletes y liquidación de transportistas')] },
    { code: 'FI', icon: 'Landmark', name: f('Financial accounting', 'Contabilidad financiera'), items: [
      f('Multi-currency ledger with revaluation', 'Libro mayor multimoneda con revaluación'),
      f('Bank reconciliation and payment runs', 'Conciliación bancaria y ejecuciones de pago'),
      f('Sales tax, year-end close and statements', 'Impuestos, cierre anual y estados financieros')] },
    { code: 'CO', icon: 'PieChart', name: f('Controlling', 'Controlling'), items: [
      f('Activity prices, allocations and key-figure cycles', 'Precios de actividad, repartos y ciclos de indicadores'),
      f('Internal orders with budget availability control', 'Órdenes internas con control de presupuesto'),
      f('Plan versions and profitability by customer and product', 'Versiones de plan y rentabilidad por cliente y producto')] },
    { code: 'PS', icon: 'FolderKanban', name: f('Projects', 'Proyectos'), items: [
      f('Work packages with budgets and budget control', 'Paquetes de trabajo con presupuesto y control'),
      f('Time, materials and purchase orders charged to projects', 'Horas, materiales y compras imputados a proyectos'),
      f('Budget vs actual and milestone billing', 'Presupuesto vs. real y facturación por hitos')] },
    { code: 'HR', icon: 'Users', name: f('Human resources', 'Recursos humanos'), items: [
      f('Employees, positions and org chart', 'Empleados, puestos y organigrama'),
      f('Leave, time sheets and expense claims', 'Ausencias, partes de horas y gastos'),
      f('Payroll posted to finance by cost center', 'Nómina contabilizada por centro de coste')] },
    { code: 'CRM', icon: 'Target', name: f('Customer relations', 'Relación con clientes'), items: [
      f('Leads and opportunity pipeline', 'Prospectos y embudo de oportunidades'),
      f('Activities and follow-ups', 'Actividades y seguimientos'),
      f('Win a deal straight into a quotation', 'Convierta una oportunidad ganada en cotización')] },
    { code: 'PM', icon: 'Wrench', name: f('Maintenance & service', 'Mantenimiento y servicio'), items: [
      f('Equipment and preventive plans', 'Equipos y planes preventivos'),
      f('Maintenance work orders', 'Órdenes de mantenimiento'),
      f('Service tickets and warranties', 'Tickets de servicio y garantías')] },
    { code: 'BI', icon: 'LayoutDashboard', name: f('Dashboards', 'Paneles'), items: [
      f('Role-aware home dashboard', 'Panel de inicio según el rol'),
      f('Drag-and-drop dashboard builder', 'Constructor de paneles de arrastrar y soltar'),
      f('Share with roles, export CSV and PNG', 'Comparta por roles y exporte a CSV y PNG')] },
  ],
  steps: [
    { title: f('Purchase order', 'Orden de compra'), entry: f('Commitment', 'Compromiso') },
    { title: f('Goods receipt', 'Recepción de mercancía'), entry: f('Dr Inventory · Cr GR/IR', 'D Inventario · H GR/IR') },
    { title: f('Supplier invoice', 'Factura del proveedor'), entry: f('Dr GR/IR · Cr Vendor', 'D GR/IR · H Proveedor') },
    { title: f('Payment', 'Pago'), entry: f('Dr Vendor · Cr Bank', 'D Proveedor · H Banco') },
    { title: f('Bank statement', 'Extracto bancario'), entry: f('Matched & reconciled', 'Conciliado') },
  ],
  pillars: [
    { title: f('Document flow', 'Flujo de documentos'), text: f('Open any document and see its whole chain, from quotation to payment, with links in both directions.', 'Abra cualquier documento y vea toda su cadena, de la cotización al pago, con enlaces en ambos sentidos.') },
    { title: f('Always balanced', 'Siempre cuadrado'), text: f('Unbalanced entries are rejected. Inventory accounts equal stock value and GR/IR equals goods not yet invoiced.', 'Los asientos descuadrados se rechazan. Las cuentas de inventario igualan el valor del stock y GR/IR la mercancía no facturada.') },
    { title: f('Controlled periods', 'Períodos controlados'), text: f('Close periods and years, carry balances forward, and reverse entries instead of deleting them.', 'Cierre períodos y ejercicios, traslade saldos y anule asientos en lugar de borrarlos.') },
  ],
  platform: [
    { icon: 'Upload', title: f('Data import', 'Importación de datos'), text: f('Load customers, vendors, materials, opening balances and open items from CSV, with a dry run first.', 'Cargue clientes, proveedores, materiales, saldos iniciales y partidas abiertas desde CSV, con prueba previa.') },
    { icon: 'KeyRound', title: f('Single sign-on & 2FA', 'Inicio de sesión único y 2FA'), text: f('Google, Microsoft or any OpenID Connect provider, plus authenticator codes, lockout and rotating sessions.', 'Google, Microsoft o cualquier proveedor OpenID Connect, con códigos de autenticador, bloqueo y sesiones rotativas.') },
    { icon: 'ShieldCheck', title: f('Roles & audit trail', 'Roles y auditoría'), text: f('Permissions per module and action, approval rules by amount, and a before/after record of every change.', 'Permisos por módulo y acción, reglas de aprobación por importe y registro antes/después de cada cambio.') },
    { icon: 'Paperclip', title: f('Attachments & email', 'Adjuntos y correo'), text: f('Attach files to any document and email POs, invoices and payslips as PDFs straight from the screen.', 'Adjunte archivos a cualquier documento y envíe pedidos, facturas y nóminas en PDF desde la pantalla.') },
    { icon: 'Terminal', title: f('T-codes & search', 'T-codes y búsqueda'), text: f('Type VA01, ME21N or FB50 in the command bar and land on the screen — familiar to SAP users from day one.', 'Escriba VA01, ME21N o FB50 en la barra de comandos y llegue a la pantalla: familiar para usuarios de SAP.') },
    { icon: 'HelpCircle', title: f('Help on every screen', 'Ayuda en cada pantalla'), text: f('Press ? for what the screen does and what each field means, plus guided tours.', 'Pulse ? para saber qué hace la pantalla y qué significa cada campo, con recorridos guiados.') },
    { icon: 'Smartphone', title: f('Install on any phone', 'Instálelo en cualquier teléfono'), text: f('Add it to the home screen like an app; warehouse tasks and the time clock are built for phones.', 'Añádalo a la pantalla de inicio como una app; las tareas de almacén y el fichaje están pensados para móviles.') },
    { icon: 'Printer', title: f('Print-ready documents', 'Documentos listos para imprimir'), text: f('Purchase orders, invoices, bills of lading, labels and payslips print cleanly or save as PDF.', 'Pedidos, facturas, conocimientos de embarque, etiquetas y nóminas se imprimen o guardan en PDF.') },
  ],
  deploy: [
    f('Single Node service with PostgreSQL — your server, your data', 'Un solo servicio Node con PostgreSQL: su servidor, sus datos'),
    f('Migrations run automatically on start', 'Las migraciones se ejecutan al iniciar'),
    f('Start from the demo company or a clean configuration', 'Comience con la empresa demo o una configuración limpia'),
    f('Scheduled jobs for depreciation, dunning and payment runs', 'Tareas programadas de amortización, reclamaciones y pagos'),
    f('Backups with standard pg_dump', 'Copias de seguridad con pg_dump estándar'),
  ],
};

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
