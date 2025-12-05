import { SEO_DEFAULTS } from '../constants/seo';

interface MetaTagsConfig {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    noindex?: boolean;
}

export function generateMetaTags(config: MetaTagsConfig) {
    const {
        title,
        description,
        keywords = [],
        canonical,
        ogImage = SEO_DEFAULTS.ogImage,
        noindex = false,
    } = config;

    return {
        title,
        description,
        keywords: [...SEO_DEFAULTS.defaultKeywords, ...keywords].join(', '),
        openGraph: {
            title,
            description,
            url: canonical || SEO_DEFAULTS.siteUrl,
            siteName: SEO_DEFAULTS.siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: SEO_DEFAULTS.locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
            creator: SEO_DEFAULTS.twitterHandle,
        },
        robots: noindex
            ? {
                index: false,
                follow: true,
            }
            : {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        alternates: {
            canonical: canonical || SEO_DEFAULTS.siteUrl,
        },
    };
}

// Generate optimized title for category pages
export function generateCategoryTitle(category: string, businessCount: number): string {
    return `${category} in Vellore | ${businessCount}+ Verified Businesses`;
}

// Generate optimized title for location pages
export function generateLocationTitle(location: string, businessCount: number): string {
    return `${location}, Vellore | ${businessCount}+ Local Businesses Near You`;
}

// Generate optimized title for location + category pages
export function generateLocationCategoryTitle(
    category: string,
    location: string,
    businessCount: number
): string {
    return `${category} in ${location} | ${businessCount}+ Options | Vellore Directory`;
}

// Generate optimized title for business pages
export function generateBusinessTitle(
    businessName: string,
    category: string,
    location?: string
): string {
    const locationPart = location ? ` in ${location}` : ' in Vellore';
    return `${businessName} - ${category}${locationPart} | Contact & Reviews`;
}

// Generate optimized description for category pages
export function generateCategoryDescription(category: string, businessCount: number): string {
    return `Find the best ${category.toLowerCase()} in Vellore. Browse ${businessCount}+ verified businesses with ratings, reviews, and contact details. Book appointments online.`;
}

// Generate optimized description for location pages
export function generateLocationDescription(location: string, businessCount: number): string {
    return `Discover local businesses in ${location}, Vellore. ${businessCount}+ listings across all categories. Find phone numbers, addresses, and reviews.`;
}

// Generate optimized description for location + category pages
export function generateLocationCategoryDescription(
    category: string,
    location: string,
    businessCount: number
): string {
    return `Looking for ${category.toLowerCase()} in ${location}? Compare ${businessCount}+ options with ratings and reviews. Get instant quotes via WhatsApp.`;
}

// Generate optimized description for business pages
export function generateBusinessDescription(
    businessName: string,
    category: string,
    location?: string
): string {
    const locationPart = location ? ` in ${location}` : ' in Vellore';
    return `${businessName} - Professional ${category.toLowerCase()}${locationPart}. View contact details, ratings, reviews, and book appointments online.`;
}
