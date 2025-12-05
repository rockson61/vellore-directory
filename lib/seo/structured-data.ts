import { businesses, categoryHierarchy, locations } from '@/lib/schema';

type Business = typeof businesses.$inferSelect;
type Category = typeof categoryHierarchy.$inferSelect;
type Location = typeof locations.$inferSelect;

interface BreadcrumbItem {
    id: number;
    name: string;
    slug: string;
}

/**
 * Generate LocalBusiness JSON-LD structured data
 * https://schema.org/LocalBusiness
 */
export function generateLocalBusinessSchema(business: Business, location?: Location) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vellore-directory.vercel.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        description: business.description || `${business.name} in Vellore`,
        url: `${baseUrl}/business/${business.slug}`,
        telephone: business.phone || undefined,
        address: business.address ? {
            '@type': 'PostalAddress',
            streetAddress: business.address,
            addressLocality: location?.name || 'Vellore',
            addressRegion: 'Tamil Nadu',
            postalCode: business.pincode || undefined,
            addressCountry: 'IN'
        } : undefined,
        geo: (business.latitude && business.longitude) ? {
            '@type': 'GeoCoordinates',
            latitude: business.latitude,
            longitude: business.longitude
        } : undefined,
        aggregateRating: business.rating ? {
            '@type': 'AggregateRating',
            ratingValue: business.rating,
            bestRating: 5,
            worstRating: 1
        } : undefined,
        openingHours: business.openingHours || undefined,
        image: business.images ? (() => {
            try {
                const imgs = typeof business.images === 'string'
                    ? JSON.parse(business.images) as string[]
                    : business.images as string[];
                return imgs[0];
            } catch {
                return undefined;
            }
        })() : undefined,
    };
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 * https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vellore-directory.vercel.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: item.name,
                item: `${baseUrl}/near-me/${item.slug}`
            }))
        ]
    };
}

/**
 * Generate ItemList JSON-LD structured data for category/location listings
 * https://schema.org/ItemList
 */
export function generateItemListSchema(
    items: Business[],
    listName: string,
    listDescription?: string
) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vellore-directory.vercel.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: listName,
        description: listDescription,
        numberOfItems: items.length,
        itemListElement: items.map((business, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'LocalBusiness',
                name: business.name,
                url: `${baseUrl}/business/${business.slug}`,
                description: business.description,
                address: business.address
            }
        }))
    };
}

/**
 * Generate Organization JSON-LD structured data for site-wide
 * https://schema.org/Organization
 */
export function generateOrganizationSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vellore-directory.vercel.app';

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Vellore Directory',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Comprehensive business directory for Vellore, Tamil Nadu. Find local businesses, services, and more.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Vellore',
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN'
        },
        sameAs: [
            // Add social media links here when available
        ]
    };
}

/**
 * Helper function to inject JSON-LD script into page
 */
export function generateJsonLdScript(data: object) {
    return {
        __html: JSON.stringify(data)
    };
}
