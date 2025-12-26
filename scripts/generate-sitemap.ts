import fs from 'fs';
import { loadEnv } from 'vite';

async function generateSitemap() {
    const mode = process.env.NODE_ENV || 'production';
    const env = loadEnv(mode, process.cwd(), '');

    const strapiUrl = env.VITE_STRAPI_URL || process.env.VITE_STRAPI_URL;
    const strapiToken = env.VITE_STRAPI_TOKEN || process.env.VITE_STRAPI_TOKEN;
    const siteUrl = env.VITE_BASE_URL || process.env.VITE_BASE_URL;

    if (!strapiUrl || !strapiToken || !siteUrl) {
        console.error('Missing VITE_STRAPI_URL, VITE_STRAPI_TOKEN, or VITE_BASE_URL environment variables');
        console.error('Available keys:', Object.keys(env).filter(k => k.startsWith('VITE_')));
        process.exit(1);
    }

    try {
        const response = await fetch(
            `${strapiUrl}/api/blog-posts?fields[0]=handle&fields[1]=updatedAt`,
            {
                headers: {
                    Authorization: `Bearer ${strapiToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Strapi API returned ${response.status}`);
        }

        const { data } = await response.json();

        // Helper to join paths correctly using URL object
        const getUrl = (path: string) => new URL(path, siteUrl).toString();

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${getUrl('/')}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${getUrl('blog')}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${data
                .map(
                    (post: any) => {
                        const handle = post.attributes?.handle || post.handle;
                        const updatedAt = post.attributes?.updatedAt || post.updatedAt;
                        return `
  <url>
    <loc>${getUrl(`blog/${handle}`)}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
                    }
                )
                .join('')}
</urlset>`;

        fs.writeFileSync('public/sitemap.xml', sitemap);
        console.log('✅ Sitemap generated successfully!');

        const robots = `User-agent: *
Allow: /
Sitemap: ${getUrl('sitemap.xml')}
`;

        fs.writeFileSync('public/robots.txt', robots);
        console.log('✅ robots.txt generated successfully!');
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
