import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { categoryHierarchy } from '@/lib/schema';

/**
 * Categories Sitemap
 * Organized by hierarchy level for better SEO
 * Total: ~515 categories
 */
export async function GET() {
    const baseUrl = 'https://top.vellore24.com';

    try {
        // Get all categories ordered by level (top-level first)
        const allCategories = await db
            .select()
            .from(categoryHierarchy)
            .orderBy(categoryHierarchy.level);

        const sitemap: MetadataRoute.Sitemap = allCategories.map(category => ({
            url: `${baseUrl}/near-me/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            // Higher priority for top-level categories
            priority: category.level === 0 ? 0.9 : category.level === 1 ? 0.7 : 0.6,
        }));

        // Generate XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified?.toISOString()}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Error generating categories sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
