import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { categoryHierarchy, businesses, locations } from '@/lib/schema';
import { eq, isNull } from 'drizzle-orm';

/**
 * SEO-Optimized Sitemap Index
 * Splits large sitemaps into multiple files for better crawling
 * Total URLs: ~17,476
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://top.vellore24.com';

    // Return sitemap index pointing to sub-sitemaps
    return [
        {
            url: `${baseUrl}/sitemap/static.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap/categories.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap/locations.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap/businesses-0.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap/businesses-1.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap/businesses-2.xml`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/sitemap/businesses-3.xml`,
            lastModified: new Date(),
        },
    ];
}
