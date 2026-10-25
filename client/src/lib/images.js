import generated from '../data/generated.json';
import screenshotList from '../data/screenshots.json';

// Each key prefers the fal.ai image produced by scripts/generate-images.mjs (listed in generated.json)
// and falls back to a matching stock photo until that image exists.
const available = new Set(generated);
const u = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const stock = {
  'hero.jpg': u('1522071820081-009f0129c71c', 2000),
  'about-team.jpg': u('1556761175-5973dc0f32e7'),
  'offices.jpg': u('1497215728101-856f4ea42174', 2000),
  'contact.jpg': u('1600880292203-757bb62b4baf'),
  'auth.jpg': u('1557804506-669a67965ba0', 1200),
  'notfound.jpg': u('1451187580459-43490279c0fa', 1200),
  'dockpass-hero.jpg': u('1586528116311-ad8dd3c8310d', 2000),
  'projects-hero.jpg': u('1460925895917-afdab827c52f', 2000),
  'portfolio-hero.jpg': u('1556742049-0cfed4f6a45d', 2000),
  'blog-hero.jpg': u('1499750310107-5fef28a66643', 2000),
  'about-hero.jpg': u('1519389950473-47ba0277781c', 2000),
  'services-hero.jpg': u('1542744173-8e7e53415bb0', 2000),

  'blog/cybersecurity.jpg': u('1563986768609-322da13575f3'),
  'blog/ai-web.jpg': u('1677442136019-21780ecad995'),
  'blog/digital-transformation.jpg': u('1551288049-bebda4e38f71'),

  'services/mobile-app-design.jpg': u('1581291518857-4e27b48ff24e', 1200),
  'services/custom-web-development.jpg': u('1555066931-4365d14bab8c', 1200),
  'services/mobile-app-development.jpg': u('1512941937669-90a1b58e7e9c', 1200),
  'services/web-app-development.jpg': u('1460925895917-afdab827c52f', 1200),
  'services/e-commerce-solutions.jpg': u('1563013544-824ae1b704d3', 1200),
  'services/digital-marketing.jpg': u('1557838923-2985c318be48', 1200),
  'services/seo-optimization.jpg': u('1432888498266-38ffec3eaf0a', 1200),
  'services/crm.jpg': u('1556761175-5973dc0f32e7', 1200),
  'services/content-writing.jpg': u('1455390582262-044cdead277a', 1200),
  'services/web-content.jpg': u('1484480974693-6ca0a78fb36b', 1200),
  'services/articles.jpg': u('1504711434969-e33886168f5c', 1200),
  'services/blog-posts.jpg': u('1486312338219-ce68d2c6f44d', 1200),
  'services/software-testing.jpg': u('1517694712202-14dd9538aa97', 1200),
  'services/aws-cloud.jpg': u('1558494949-ef010cbdcc31', 1200),
  'services/api-development.jpg': u('1488590528505-98d2b5aba04b', 1200),
  'services/custom-database.jpg': u('1544383835-bda2bc66a55d', 1200),

  'categories/home.jpg': u('1570129477492-45c003edd2be', 1000),
  'categories/food.jpg': u('1555396273-367ea4eb4db5', 1000),
  'categories/business.jpg': u('1521791136064-7986c2920216', 1000),
  'categories/realestate.jpg': u('1600596542815-ffad4c1539a9', 1000),
  'categories/wellness.jpg': u('1544161515-4ab6ce6db874', 1000),
  'categories/education.jpg': u('1511379938547-c1f69419868d', 1000),
  'categories/creative.jpg': u('1452587925148-ce544e77e70d', 1000),
  'categories/events.jpg': u('1519741497674-611481863552', 1000),
  'categories/automotive.jpg': u('1492144534655-ae79c964c9d7', 1000),
  'categories/ecommerce.jpg': u('1556745757-8d76bdb6984b', 1000),
  'categories/saas.jpg': u('1586528116311-ad8dd3c8310d', 1000),
  'categories/finance.jpg': u('1554224155-6726b3ff858f', 1000),
  'categories/outdoor.jpg': u('1551632811-561732d1e306', 1000),
  'categories/pets.jpg': u('1587300003388-59208cc962cb', 1000),
  'categories/industrial.jpg': u('1504328345606-18bbc8c9d7d1', 1000),
  'categories/apps.jpg': u('1551288049-bebda4e38f71', 1000),
};

export function img(key) {
  if (available.has(key)) return `/generated/${key}`;
  return stock[key] || stock['hero.jpg'];
}

// Screenshots captured locally by scripts/capture-screenshots.mjs (no paid third-party service).
const screenshots = new Set(screenshotList);
const screenshotFile = (url) => url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.jpg';

// Best available thumbnail for a project: explicit image → captured screenshot → industry photo.
export function projectImage(project) {
  if (project.image) return project.image;
  if (project.url) {
    const file = screenshotFile(project.url);
    if (screenshots.has(file)) return `/screenshots/${file}`;
  }
  return img(`categories/${project.category}.jpg`);
}
