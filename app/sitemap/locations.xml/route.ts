import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { locations } from '@/lib/schema';

/**
 * Locations Sitemap
 * All Vellore area locations
 * Total: ~383 locations
 */
export async function GET() {
    const baseUrl = 'https://top.vellore24.com';

    try {
        const allLocations = await db
            .select()
            .from(locations)
            .orderBy(locations.name);

        const sitemap: MetadataRoute.Sitemap = allLocations.map(location => ({
            url: `${baseUrl}/near-me/${location.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

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
        console.error('Error generating locations sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
