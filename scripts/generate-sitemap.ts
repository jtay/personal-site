import fs from 'fs';
import 'dotenv/config';

async function generateSitemap() {
    const strapiUrl = process.env.VITE_STRAPI_URL;
    const strapiToken = process.env.VITE_STRAPI_TOKEN;
    const siteUrl = process.env.VITE_BASE_URL;

    if (!strapiUrl || !strapiToken || !siteUrl) {
        console.error('Missing VITE_STRAPI_URL, VITE_STRAPI_TOKEN, or VITE_BASE_URL environment variables');
        process.exit(1);
    }

    // Remove trailing slash from Strapi URL if present to avoid double slashes
    const cleanStrapiUrl = strapiUrl.replace(/\/$/, '');

    try {
        const params = new URLSearchParams();
        params.append('fields[0]', 'handle');
        params.append('fields[1]', 'updatedAt');

        const response = await fetch(
            `${cleanStrapiUrl}/api/blog-posts?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${strapiToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Strapi API returned ${response.status}: ${errorText}`);
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
  ${data.map((post: any) => {
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
