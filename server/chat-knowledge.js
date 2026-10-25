// Knowledge the chat assistant answers from, plus an offline FAQ used when no Anthropic credentials are configured.
import { db } from './db.js';

const SERVICES = [
  'Custom Web Development', 'E-commerce Solutions (Shopify, WooCommerce, custom)', 'Web App Development (React, Next.js, Node.js)',
  'Mobile App Development (iOS/Android, React Native, Flutter)', 'Mobile App Design (UI/UX)', 'AWS Cloud Integration',
  'SEO Optimization', 'Digital Marketing', 'CRM Development', 'API Development', 'Custom Database Solutions',
  'Software Testing / QA', 'Content Writing', 'Web Content', 'Articles', 'Blog Posts',
];

const CATEGORY_NAMES = {
  home: 'Home Services', food: 'Food & Hospitality', business: 'Professional Services', realestate: 'Real Estate',
  wellness: 'Health & Wellness', education: 'Education', creative: 'Media & Creative', events: 'Events & Entertainment',
  automotive: 'Automotive & Marine', ecommerce: 'E-commerce & Retail', saas: 'SaaS product', finance: 'Finance & Insurance',
  outdoor: 'Sports & Outdoors', pets: 'Pets & Animals', apps: 'Web Apps & Tools', industrial: 'Industrial & Engineering',
};

let cached = { text: '', at: 0 };

// Rebuilt at most once a minute so CMS edits show up while the prompt stays byte-stable for caching.
export function systemPrompt() {
  if (Date.now() - cached.at < 60_000 && cached.text) return cached.text;
  const projects = db.prepare("SELECT kind, name, url, category, desc_en FROM projects WHERE kind != 'design' ORDER BY sort, id").all();
  const projectLines = projects.map((p) => `- ${p.name} (${CATEGORY_NAMES[p.category] || p.category}) — ${p.desc_en}${p.url ? ` — ${p.url}` : ''}`).join('\n');

  const text = `You are the website assistant for AMS IT Services (amsitservices.com). You chat with visitors on the company website.

Your job: answer questions about the company, its services, its portfolio and its flagship product DockPass, and help interested visitors take the next step (request a quote, book a call, or create an account to message the team).

How to answer:
- Reply in the visitor's language (English or Spanish), matching the language of their latest message.
- Keep replies short and friendly: 1–4 sentences or a brief list. This is a small chat window.
- Use only the facts below. If you don't know something (for example exact prices or timelines), say the team will confirm it and point them to the contact page. Never invent prices, clients, guarantees or features.
- Pricing depends on scope; every project includes a free business strategy consultation.
- When a visitor shows buying intent, suggest: "Get a quote" at /contact, "Schedule a call" at /contact, or creating a free account at /register to message the team directly.
- You can link to pages on this site with relative paths: /services, /projects, /portfolio, /dockpass, /about, /blog, /contact, /register.
- Plain text only — no markdown headings, tables, bold or asterisks. Short bullet lists with "- " are fine.
- Speak as AMS IT Services ("we"). Don't mention which AI model you are.
- Stay on topic. For unrelated requests, politely steer back to how AMS IT Services can help.

COMPANY
- AMS IT Services — full-cycle IT company. Tagline: "Driving Global Excellence through Innovation".
- Offices: USA head office in Memphis, Tennessee; India development hub in Hyderabad.
- 8+ years of experience, 50+ team members, 185+ websites, 235+ e-commerce stores, 21+ mobile apps, rated 4.7/5 by 1,200+ customers.
- Contact: mudassir@amsitservices.com (reply within 24 hours), phone +1 (901) 415-0779 (fastest). Hours: Mon–Fri, 9:00 AM – 6:00 PM IST.
- Process: Discovery → Architecture → Agile development → QA testing → Launch & support.
- Founder & developer: Mudassir Shaik.

SERVICES
${SERVICES.map((s) => `- ${s}`).join('\n')}

FLAGSHIP PRODUCT: DOCKPASS (https://dockpass.org, details at /dockpass)
- Pickup verification for warehouses: "Know exactly who drives away with your freight."
- Checks every driver live against a government ID (license authenticity + live selfie face match), issues a single-use QR pass, and requires security gate, loading dock and final approval to agree before a truck leaves.
- Guards scan passes with any phone camera; no hardware, no app for drivers, live in 15 minutes. Denied scans alert the team; every scan is logged (who, where, when).
- Problems solved: fictitious pickups, unverifiable paperwork, no audit trail.
- For 3PL warehouses, food & beverage, electronics, pharma, retail distribution and cold chain.
- Register at https://dockpass.org/register, book a demo at https://dockpass.org/contact. Pricing: quote-based.

PROJECTS WE BUILT AND HOST (${projects.length} live sites and apps, mostly on *.amsitservices.com)
${projectLines}

E-COMMERCE DESIGN PORTFOLIO (/portfolio): Volt Electronics, Luxe Threads, Pet Pulse, Artisanal Attic, Hike & Peak, Retro Grooves, Ink & Paper, Sole Search, Zen Den, Sprout & Seed, Bloom Box.`;

  cached = { text, at: Date.now() };
  return text;
}

// Offline answers, matched by keywords, so the widget stays useful without an API key.
const FAQ = [
  {
    keys: ['dockpass', 'dock', 'warehouse', 'driver', 'freight', 'almacén', 'almacen', 'conductor', 'carga'],
    en: 'DockPass is our flagship product: it verifies every warehouse pickup driver live against a government ID, issues a single-use QR pass, and makes the gate, dock and final approval agree before a truck leaves. No hardware, no driver app, live in 15 minutes. Learn more at /dockpass or https://dockpass.org.',
    es: 'DockPass es nuestro producto insignia: verifica en vivo a cada conductor con su identificación oficial, emite un pase QR de un solo uso y exige que puerta, muelle y aprobación coincidan antes de que salga el camión. Sin hardware ni app para conductores, activo en 15 minutos. Más en /dockpass o https://dockpass.org.',
  },
  {
    keys: ['price', 'pricing', 'cost', 'quote', 'budget', 'how much', 'precio', 'costo', 'cuesta', 'tarifa', 'cotiz', 'presupuesto', 'cuánto', 'cuanto'],
    en: 'Pricing depends on your project’s scope, and every project includes a free business strategy consultation. Tell us what you need at /contact and we’ll reply within 24 hours with a quote.',
    es: 'El precio depende del alcance del proyecto, y cada proyecto incluye una consulta gratuita de estrategia. Cuéntenos lo que necesita en /contact y le responderemos en 24 horas con una cotización.',
  },
  {
    keys: ['project', 'portfolio', 'work', 'example', 'built', 'proyecto', 'portafolio', 'ejemplo', 'trabajo'],
    en: 'We’ve built and host 150+ live websites and apps across 15 industries — home services, healthcare, finance, legal, restaurants, real estate, industrial and more. Browse them at /projects, and see our e-commerce designs at /portfolio.',
    es: 'Hemos creado y alojamos más de 150 sitios y apps en 15 industrias: servicios del hogar, salud, finanzas, legal, restaurantes, bienes raíces, industria y más. Véalos en /projects y nuestros diseños e-commerce en /portfolio.',
  },
  {
    keys: ['mobile', 'app', 'ios', 'android', 'móvil', 'movil', 'aplicación', 'aplicacion'],
    en: 'Yes — we design and build iOS and Android apps (native, React Native and Flutter), from MVP to App Store and Google Play. Details at /services/mobile-app-development.',
    es: 'Sí, diseñamos y desarrollamos apps para iOS y Android (nativas, React Native y Flutter), del MVP a App Store y Google Play. Detalles en /services/mobile-app-development.',
  },
  {
    keys: ['ecommerce', 'e-commerce', 'shop', 'store', 'shopify', 'woocommerce', 'tienda'],
    en: 'We’ve launched 235+ online stores on Shopify, WooCommerce and custom platforms, with payments, shipping and inventory dashboards. See /services/e-commerce-solutions.',
    es: 'Hemos lanzado más de 235 tiendas en Shopify, WooCommerce y plataformas a medida, con pagos, envíos y paneles de inventario. Vea /services/e-commerce-solutions.',
  },
  {
    keys: ['seo', 'marketing', 'google', 'ads', 'social', 'redes'],
    en: 'We offer SEO (technical audits, keywords, local SEO) and digital marketing (Google Ads, social media, email). See /services/seo-optimization and /services/digital-marketing.',
    es: 'Ofrecemos SEO (auditorías técnicas, palabras clave, SEO local) y marketing digital (Google Ads, redes sociales, email). Vea /services/seo-optimization y /services/digital-marketing.',
  },
  {
    keys: ['cloud', 'aws', 'hosting', 'server', 'nube', 'servidor'],
    en: 'We architect, migrate and manage cloud infrastructure on AWS, including Docker deployments, monitoring and backups. See /services/aws-cloud.',
    es: 'Diseñamos, migramos y gestionamos infraestructura en AWS, incluidos despliegues con Docker, monitoreo y copias de seguridad. Vea /services/aws-cloud.',
  },
  {
    keys: ['contact', 'email', 'phone', 'call', 'talk', 'human', 'person', 'contacto', 'correo', 'teléfono', 'telefono', 'llamar', 'hablar'],
    en: 'You can reach us at mudassir@amsitservices.com or +1 (901) 415-0779 (Mon–Fri, 9 AM–6 PM IST). You can also book a call at /contact, or create a free account at /register to message the team directly.',
    es: 'Puede escribirnos a mudassir@amsitservices.com o llamar al +1 (901) 415-0779 (lun–vie, 9 AM–6 PM IST). También puede agendar una llamada en /contact o crear una cuenta gratuita en /register para escribir al equipo.',
  },
  {
    keys: ['where', 'location', 'office', 'memphis', 'hyderabad', 'india', 'usa', 'dónde', 'donde', 'oficina', 'ubicación'],
    en: 'Our USA head office is in Memphis, Tennessee, and our development hub is in Hyderabad, India — so work moves forward around the clock.',
    es: 'Nuestra oficina central está en Memphis, Tennessee, y nuestro centro de desarrollo en Hyderabad, India, así que el trabajo avanza las 24 horas.',
  },
  {
    keys: ['service', 'offer', 'do you', 'what can', 'servicio', 'ofrecen', 'hacen'],
    en: 'We offer custom web development, e-commerce, web apps, mobile apps, UI/UX design, AWS cloud, SEO, digital marketing, CRM, APIs, databases, QA testing and content writing. Explore everything at /services.',
    es: 'Ofrecemos desarrollo web a medida, e-commerce, aplicaciones web y móviles, diseño UI/UX, nube AWS, SEO, marketing digital, CRM, APIs, bases de datos, pruebas de software y redacción. Vea todo en /services.',
  },
];

export function faqAnswer(text, lang) {
  const q = text.toLowerCase();
  const hit = FAQ.find((f) => f.keys.some((k) => q.includes(k)));
  if (hit) return hit[lang];
  return lang === 'es'
    ? 'Con gusto le ayudo con nuestros servicios, proyectos o DockPass. Para algo específico, nuestro equipo responde en 24 horas en /contact, o puede crear una cuenta en /register para escribirnos directamente.'
    : 'Happy to help with our services, projects or DockPass. For anything specific, our team replies within 24 hours via /contact — or create a free account at /register to message us directly.';
}
