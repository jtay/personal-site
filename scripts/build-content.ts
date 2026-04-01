import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paths
const CONTENT_DIR = path.resolve('public/content/blog');
const BLOG_INDEX_FILE = path.resolve('src/data/blog-index.json');
const CATEGORIES_FILE = path.resolve('src/data/categories.json');
const SITEMAP_FILE = path.resolve('public/sitemap.xml');
const ROBOTS_FILE = path.resolve('public/robots.txt');

const DOMAIN = 'https://susan.com'; // Change to actual domain

async function buildContent() {
  console.log('Building content and generating sitemap...');

  // 1. Build Blog Index
  const posts: any[] = [];
  
  if (fs.existsSync(CONTENT_DIR)) {
    const postDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    for (const dir of postDirs) {
      const handle = dir.name;
      const mdPath = path.join(CONTENT_DIR, handle, 'index.md');
      
      if (fs.existsSync(mdPath)) {
        const fileContent = fs.readFileSync(mdPath, 'utf8');
        const { data } = matter(fileContent);
        
        posts.push({
          handle,
          title: data.title || handle,
          subtitle: data.subtitle || '',
          publishedAt: data.publishedAt || new Date().toISOString(),
          tags: data.tags || [],
          categories: data.categories || [],
          featuredImage_landscape: data.featuredImage_landscape ? { url: `/content/blog/${handle}/${data.featuredImage_landscape}` } : null,
          featuredImage_portrait: data.featuredImage_portrait ? { url: `/content/blog/${handle}/${data.featuredImage_portrait}` } : null
        });
      }
    }
  } else {
    console.warn(`Content directory ${CONTENT_DIR} not found. Creating it.`);
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Write blog-index.json
  const dataDir = path.dirname(BLOG_INDEX_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(BLOG_INDEX_FILE, JSON.stringify(posts, null, 2));
  console.log(`✅ Generated blog index with ${posts.length} posts.`);

  // 1.5 Generate Categories
  const categoryNames = new Set<string>();
  posts.forEach(post => {
    (post.categories || []).forEach((cat: string) => categoryNames.add(cat));
  });
  
  const categories = Array.from(categoryNames).map(name => ({
    name,
    handle: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }));
  
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
  console.log(`✅ Generated categories index with ${categories.length} categories.`);

  // 2. Generate Sitemap
  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/tools',
  ];

  const allUrls = [
    ...staticRoutes.map(route => `${DOMAIN}${route}`),
    ...posts.map(post => `${DOMAIN}/blog/${post.handle}`)
  ];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${url === DOMAIN + '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_FILE, sitemapContent);
  console.log(`✅ Generated sitemap.xml with ${allUrls.length} URLs.`);

  // 3. Generate Robots.txt
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml`;
  fs.writeFileSync(ROBOTS_FILE, robotsContent);
  console.log(`✅ Generated robots.txt.`);
}

buildContent().catch(err => {
  console.error('Error building content:', err);
  process.exit(1);
});
