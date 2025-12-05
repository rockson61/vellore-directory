import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { businesses, locations, categoryHierarchy } from '@/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Businesses Sitemap - Part 1 (0-4999)
 * Total businesses: ~16,568
 * Split into 4 parts for optimal crawling
 */
export async function GET() {
    const baseUrl = 'https://top.vellore24.com';
    const CHUNK_SIZE = 5000;
    const OFFSET = 0;

    try {
        const allBusinesses = await db
            .select({
                slug: businesses.slug,
                updatedAt: businesses.updatedAt,
                locationSlug: locations.slug,
                categorySlug: categoryHierarchy.slug,
            })
            .from(businesses)
            .leftJoin(locations, eq(businesses.pincode, locations.pincode))
            .leftJoin(categoryHierarchy, eq(businesses.category, categoryHierarchy.name))
            .limit(CHUNK_SIZE)
            .offset(OFFSET);

        const sitemap: MetadataRoute.Sitemap = allBusinesses
            .filter(b => b.slug && b.locationSlug && b.categorySlug)
            .map(business => ({
                url: `${baseUrl}/business/${business.slug}`,
                lastModified: business.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
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
        console.error('Error generating businesses sitemap 0:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
