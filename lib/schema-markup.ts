// Schema markup utilities for SEO

interface LocalBusinessSchema {
    name: string;
    description?: string;
    address?: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode?: string;
        addressCountry: string;
    };
    telephone?: string;
    url?: string;
    image?: string;
    priceRange?: string;
    openingHours?: string[];
    geo?: {
        latitude: number;
        longitude: number;
    };
}

export function generateLocalBusinessSchema(business: LocalBusinessSchema) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        description: business.description,
        address: business.address ? {
            '@type': 'PostalAddress',
            streetAddress: business.address.streetAddress,
            addressLocality: business.address.addressLocality,
            addressRegion: business.address.addressRegion,
            postalCode: business.address.postalCode,
            addressCountry: business.address.addressCountry,
        } : undefined,
        telephone: business.telephone,
        url: business.url,
        image: business.image,
        priceRange: business.priceRange,
        openingHoursSpecification: business.openingHours?.map(hours => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hours,
        })),
        geo: business.geo ? {
            '@type': 'GeoCoordinates',
            latitude: business.geo.latitude,
            longitude: business.geo.longitude,
        } : undefined,
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Vellore Directory',
        description: 'Local business directory for Vellore, Tamil Nadu. Find restaurants, hospitals, shops, and services near you.',
        url: 'https://vellore-directory.vercel.app',
        logo: 'https://vellore-directory.vercel.app/logo.png',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Vellore',
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            areaServed: 'IN',
            availableLanguage: ['en', 'ta'],
        },
        sameAs: [
            // Add social media URLs when available
        ],
    };
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

interface FAQItem {
    question: string;
    answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

export function generateProductSchema(product: {
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    availability?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency || 'INR',
            availability: product.availability || 'https://schema.org/InStock',
        },
    };
}

export function generateAggregateRatingSchema(rating: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AggregateRating',
        ratingValue: rating.ratingValue,
        reviewCount: rating.reviewCount,
        bestRating: rating.bestRating || 5,
        worstRating: rating.worstRating || 1,
    };
}
