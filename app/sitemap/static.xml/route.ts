import { MetadataRoute } from 'next';

/**
 * Static Pages Sitemap
 * High-priority pages that change frequently
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://top.vellore24.com';

    return [
        // Homepage - Highest priority
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        // Main navigation pages
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
        // Secondary pages
        {
            url: `${baseUrl}/appointments`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
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
        // Utility pages
        {
            url: `${baseUrl}/sitemap-html`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        // Legal pages - Low priority
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
}
