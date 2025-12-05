// Generate breadcrumb schema for any page
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };
}

// Generate LocalBusiness schema for business pages
export function generateLocalBusinessSchema(business: {
    name: string;
    description?: string | null;
    address: string;
    phone?: string | null;
    website?: string | null;
    category: string;
    rating?: string | null;
    totalRatings?: number | null;
    latitude?: string | null;
    longitude?: string | null;
    openingHours?: string | null;
    priceRange?: string | null;
}) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        description: business.description || `${business.name} - ${business.category} in Vellore`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: business.address,
            addressLocality: 'Vellore',
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN',
        },
        telephone: business.phone || undefined,
        url: business.website || undefined,
    };

    // Add geo coordinates if available
    if (business.latitude && business.longitude) {
        schema.geo = {
            '@type': 'GeoCoordinates',
            latitude: business.latitude,
            longitude: business.longitude,
        };
    }

    // Add aggregate rating if available
    if (business.rating && business.totalRatings && parseFloat(business.rating) > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: business.rating,
            reviewCount: business.totalRatings,
            bestRating: '5',
            worstRating: '1',
        };
    }

    // Add price range if available
    if (business.priceRange) {
        schema.priceRange = business.priceRange;
    }

    return schema;
}

// Generate CollectionPage schema for category/location listing pages
export function generateCollectionPageSchema(data: {
    name: string;
    description: string;
    url: string;
    numberOfItems: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: data.name,
        description: data.description,
        url: data.url,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: data.numberOfItems,
        },
    };
}

// Generate WebSite schema with search action
export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Vellore Directory',
        url: 'https://vellore-directory.vercel.app',
        description: 'Find the best local businesses in Vellore, Tamil Nadu. Browse 3,799+ verified businesses across 585 categories.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://vellore-directory.vercel.app/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

// Generate ItemList schema for business listings
export function generateItemListSchema(businesses: Array<{
    name: string;
    url: string;
    position: number;
}>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: businesses.map((business) => ({
            '@type': 'ListItem',
            position: business.position,
            item: {
                '@type': 'Thing',
                name: business.name,
                url: business.url,
            },
        })),
    };
}
