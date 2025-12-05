import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { categoryHierarchy, businesses, locations } from '@/lib/schema';
import { eq, sql, isNull } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://vellore-directory.vercel.app';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/near-me`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/appointments`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sitemap-html`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];


    // Get all categories
    const allCategories = await db
        .select()
        .from(categoryHierarchy);

    const categoryPages: MetadataRoute.Sitemap = allCategories.map(category => ({
        url: `${baseUrl}/near-me/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: category.level === 0 ? 0.9 : category.level === 1 ? 0.7 : 0.6,
    }));

    // Get all locations
    const allLocations = await db
        .select()
        .from(locations);

    const locationPages: MetadataRoute.Sitemap = allLocations.map(location => ({
        url: `${baseUrl}/near-me/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Get all businesses with location and category slugs
    // Note: This assumes a business belongs to one location (via pincode) and one category
    const allBusinesses = await db
        .select({
            slug: businesses.slug,
            updatedAt: businesses.updatedAt,
            locationSlug: locations.slug,
            categorySlug: categoryHierarchy.slug,
        })
        .from(businesses)
        .leftJoin(locations, eq(businesses.pincode, locations.pincode))
        .leftJoin(categoryHierarchy, eq(businesses.category, categoryHierarchy.name));


    const businessPages: MetadataRoute.Sitemap = allBusinesses
        .filter(b => b.slug && b.locationSlug && b.categorySlug) // Only include if we can construct full path
        .map(business => ({
            url: `${baseUrl}/near-me/${business.locationSlug}/${business.categorySlug}/${business.slug}`,
            lastModified: business.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

    return [...staticPages, ...categoryPages, ...locationPages, ...businessPages];
}
