// SEO default values and utilities
export const SEO_DEFAULTS = {
    siteName: 'Vellore Directory',
    siteUrl: 'https://vellore-directory.vercel.app',
    defaultTitle: 'Vellore Directory | Find Local Businesses in Vellore, Tamil Nadu',
    defaultDescription: 'Discover the best local businesses, restaurants, hospitals, shops, and services in Vellore, Tamil Nadu. Browse by category, book appointments, and connect via WhatsApp.',
    defaultKeywords: [
        'vellore directory',
        'vellore businesses',
        'local businesses vellore',
        'vellore services',
        'businesses near me vellore',
        'vellore tamil nadu',
    ],
    twitterHandle: '@VelloreDirectory',
    ogImage: '/og-image.jpg',
    locale: 'en_IN',
};

// Generate page title
export function generateTitle(pageTitle?: string): string {
    if (!pageTitle) return SEO_DEFAULTS.defaultTitle;
    return `${pageTitle} | ${SEO_DEFAULTS.siteName}`;
}

// Generate meta description
export function generateDescription(description?: string): string {
    return description || SEO_DEFAULTS.defaultDescription;
}

// Generate canonical URL
export function generateCanonicalUrl(path: string): string {
    return `${SEO_DEFAULTS.siteUrl}${path}`;
}

// Generate keywords
export function generateKeywords(additionalKeywords: string[] = []): string {
    return [...SEO_DEFAULTS.defaultKeywords, ...additionalKeywords].join(', ');
}
