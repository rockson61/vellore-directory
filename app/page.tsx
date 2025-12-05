import { db } from '@/lib/db';
import { categoryHierarchy, businesses } from '@/lib/schema';
import { isNull, eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateOrganizationSchema, generateFAQSchema } from '@/lib/schema-markup';
import { SearchBar } from '@/components/search/SearchBar';
import { TrustBadges } from '@/components/marketing/TrustBadges';
import { SocialProof } from '@/components/marketing/SocialProof';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { CTABanner } from '@/components/marketing/CTABanner';
import { QuickContact } from '@/components/marketing/QuickContact';
import { generateWebSiteSchema } from '@/lib/seo/schema-generators';

export const metadata = {
    title: 'Vellore Directory | Find Local Businesses in Vellore, Tamil Nadu',
    description: 'Discover the best local businesses, restaurants, hospitals, shops, and services in Vellore, Tamil Nadu. Browse by category, book appointments, and connect via WhatsApp.',
};

const nearbyLocations = [
    'Katpadi', 'Bagayam', 'Gandhi Nagar', 'Sathuvachari', 'Thottapalayam',
    "Officer's Line", 'Kosapet', 'Voorhees', 'Old Katpadi', 'Sankaranpalayam'
];

const popularSearches = [
    'Restaurants near me in Vellore',
    'Hospitals in Vellore',
    'Dental clinics in Vellore',
    'Shopping malls in Vellore',
    'Hotels in Vellore',
    'Pharmacies near me Vellore',
    'Beauty salons in Vellore',
    'Gyms in Vellore',
    'Schools in Vellore',
    'Auto repair shops Vellore'
];

export default async function HomePage() {
    const rootCategories = await db
        .select()
        .from(categoryHierarchy)
        .where(isNull(categoryHierarchy.parentId))
        .orderBy(categoryHierarchy.displayOrder);

    // Get business counts for each root category (including all subcategories)
    const categoryCounts = await Promise.all(
        rootCategories.map(async (category) => {
            // Get all descendant category names using recursive CTE
            const descendants = await db.execute(sql`
                WITH RECURSIVE category_tree AS (
                    SELECT id, name FROM category_hierarchy WHERE id = ${category.id}
                    UNION ALL
                    SELECT ch.id, ch.name 
                    FROM category_hierarchy ch
                    INNER JOIN category_tree ct ON ch.parent_id = ct.id
                )
                SELECT name FROM category_tree
            `);

            const categoryNames = descendants.rows.map((row: any) => row.name);

            // Count businesses in any of these categories
            const count = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(businesses)
                .where(sql`${businesses.category} IN (${sql.join(categoryNames.map(name => sql`${name}`), sql`, `)})`);

            return {
                ...category,
                businessCount: count[0]?.count || 0
            };
        })
    );

    // Schema markup
    const organizationSchema = generateOrganizationSchema();
    const websiteSchema = generateWebSiteSchema();
    const faqSchema = generateFAQSchema([
        {
            question: 'How do I find businesses near me in Vellore?',
            answer: 'Browse our categories above or use the search function to find specific businesses. Each listing includes the exact address, contact details, and distance from your location.'
        },
        {
            question: 'Can I book appointments online through Vellore Directory?',
            answer: 'Yes! Many professional services like doctors, dentists, salons, and consultants offer online appointment booking. Look for the "Book Appointment" button on their business page.'
        },
        {
            question: 'How do I contact businesses via WhatsApp?',
            answer: 'Click the WhatsApp button on any business listing to start a direct conversation. You can inquire about services, prices, availability, or place orders instantly.'
        },
        {
            question: 'Are the business listings verified and up-to-date?',
            answer: 'Yes, we regularly verify and update all business information including phone numbers, addresses, operating hours, and services offered to ensure accuracy.'
        },
        {
            question: 'What areas of Vellore are covered in this directory?',
            answer: 'We cover all major areas including Katpadi, Bagayam, Gandhi Nagar, Sathuvachari, Thottapalayam, Officer\'s Line, Kosapet, Voorhees, New Town, Old Town, and surrounding localities.'
        }
    ]);

    return (
        <>
            <SchemaMarkup schema={[organizationSchema, websiteSchema, faqSchema]} />
            <div className="min-h-screen">
                {/* Main Content */}
                <main className="container mx-auto px-4 py-12">
                    {/* Hero Section */}
                    <section className="text-center mb-16 py-12 gradient-hero rounded-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6">
                            Find <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Local Businesses</span> in Vellore
                        </h1>
                        <p className="text-slate-600 mb-8 text-lg md:text-xl max-w-2xl mx-auto">
                            Discover top-rated shops, services, and professionals near you
                        </p>
                        <div className="max-w-2xl mx-auto">
                            <SearchBar />
                        </div>
                    </section>

                    {/* Browse Categories */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Browse by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {categoryCounts.map(category => (
                                <Link
                                    key={category.id}
                                    href={`/near-me/${category.slug}`}
                                    className="category-card group"
                                >
                                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                                        {category.icon}
                                    </div>
                                    <h3 className="font-bold text-base text-slate-800 mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {category.businessCount} {category.businessCount === 1 ? 'place' : 'places'}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Trust Badges */}
                    <section className="mb-16">
                        <TrustBadges />
                    </section>

                    {/* Why Choose Vellore Directory */}
                    <section className="mb-16 bg-white rounded-3xl p-8 md:p-12 shadow-card">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                            Why Choose Vellore Directory?
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                                    <span>📱</span> Instant WhatsApp Connect
                                </h3>
                                <p className="text-text-secondary text-sm">
                                    Contact businesses directly through WhatsApp for quick inquiries, orders, and real-time communication.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                                    <span>📅</span> Online Appointment Booking
                                </h3>
                                <p className="text-text-secondary text-sm">
                                    Book appointments with doctors, salons, and service providers instantly without phone calls.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                                    <span>✓</span> Verified Local Businesses
                                </h3>
                                <p className="text-text-secondary text-sm">
                                    All listings include verified contact information, addresses, operating hours, and customer reviews.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* H2: Popular Services in Vellore */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Popular Services in Vellore
                        </h2>
                        <p className="text-slate-600 mb-8">
                            Most searched services by Vellore residents
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl p-6 shadow-card">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🏥</span> Healthcare & Medical
                                </h3>
                                <ul className="space-y-3">
                                    <li className="border-l-2 border-primary-400 pl-3">
                                        <h4 className="font-semibold text-slate-900">
                                            Hospitals and Clinics in Vellore
                                        </h4>
                                        <p className="text-sm text-slate-600">
                                            24/7 emergency care, specialist consultations, and diagnostic services
                                        </p>
                                    </li>
                                    <li>
                                        <h4 className="font-semibold text-text-primary">
                                            Dental Clinics in Vellore
                                        </h4>
                                        <p className="text-sm text-text-secondary">
                                            Cosmetic dentistry, orthodontics, and general dental care
                                        </p>
                                    </li>
                                    <li>
                                        <h4 className="font-semibold text-text-primary">
                                            Pharmacies Near Me
                                        </h4>
                                        <p className="text-sm text-text-secondary">
                                            24-hour pharmacies with home delivery services
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-3">
                                    Food & Dining
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <h4 className="font-semibold text-text-primary">
                                            Restaurants in Vellore
                                        </h4>
                                        <p className="text-sm text-text-secondary">
                                            Multi-cuisine dining, family restaurants, and fine dining options
                                        </p>
                                    </li>
                                    <li>
                                        <h4 className="font-semibold text-text-primary">
                                            Cafes and Coffee Shops
                                        </h4>
                                        <p className="text-sm text-text-secondary">
                                            Cozy cafes, specialty coffee, and study-friendly spaces
                                        </p>
                                    </li>
                                    <li>
                                        <h4 className="font-semibold text-text-primary">
                                            Fast Food and Quick Bites
                                        </h4>
                                        <p className="text-sm text-text-secondary">
                                            Burgers, pizzas, and quick meal options with delivery
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* H2: Related Categories */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Related Business Categories
                        </h2>
                        <p className="text-slate-600 mb-8">
                            Explore more services available in Vellore
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { name: 'Beauty Salons', slug: 'services-beauty-and-personal-care' },
                                { name: 'Gyms & Fitness', slug: 'entertainment-and-recreation-sports-and-fitness' },
                                { name: 'Auto Repair', slug: 'services-automotive' },
                                { name: 'Pet Stores', slug: 'shopping-and-retail-specialty-shops-pet-store' },
                                { name: 'Home Services', slug: 'services-home-services' },
                                { name: 'Electronics Shops', slug: 'shopping-and-retail-electronics-and-computers' },
                                { name: 'Clothing Stores', slug: 'shopping-and-retail-clothing-and-fashion' },
                                { name: 'Bookstores', slug: 'shopping-and-retail-specialty-shops-bookstore' },
                                { name: 'Travel Agencies', slug: 'services-travel-and-tourism' },
                                { name: 'Event Planners', slug: 'services-event-planning' }
                            ].map((cat, index) => (
                                <Link
                                    key={index}
                                    href={`/near-me/${cat.slug}`}
                                    className="bg-white rounded-2xl p-3 shadow-card text-center hover:shadow-hover hover:-translate-y-1 transition-all"
                                >
                                    <h4 className="font-semibold text-sm text-slate-800">
                                        {cat.name}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* H2: Nearby Locations */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Nearby Locations in Vellore
                        </h2>
                        <p className="text-slate-600 mb-8">
                            Find businesses in these popular areas
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {nearbyLocations.map((location, index) => (
                                <Link
                                    key={index}
                                    href={`/near-me/${location.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="bg-white rounded-2xl p-3 shadow-card text-center hover:shadow-hover hover:-translate-y-1 transition-all"
                                >
                                    <h5 className="font-semibold text-sm text-slate-800">
                                        {location}
                                    </h5>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Social Proof Stats */}
                    <section className="mb-16">
                        <SocialProof />
                    </section>

                    {/* Testimonials Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
                            What Our Users Say
                        </h2>
                        <p className="text-slate-600 mb-8 text-center">
                            Hear from people who use Vellore Directory every day
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                        R
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Rajesh Kumar</div>
                                        <div className="text-sm text-slate-500">Katpadi, Vellore</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-accent-500">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm">
                                    "Vellore Directory made it so easy to find a good dentist near my home. The WhatsApp feature is really convenient for quick inquiries!"
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold">
                                        P
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Priya Sharma</div>
                                        <div className="text-sm text-slate-500">Gandhi Nagar, Vellore</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-accent-500">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm">
                                    "I discovered amazing local restaurants and cafes through this directory. The ratings and reviews are very helpful in making decisions."
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                                        A
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Arun Prakash</div>
                                        <div className="text-sm text-slate-500">Sathuvachari, Vellore</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-accent-500">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm">
                                    "As a business owner, listing my shop here brought more customers. The platform is user-friendly and reaches the right audience."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* H3: Frequently Asked Questions */}
                    <section className="mb-16 bg-white rounded-3xl p-8 md:p-12 shadow-card">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div className="border-l-4 border-primary-500 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    How do I find businesses near me in Vellore?
                                </h3>
                                <p className="text-slate-600">
                                    Browse our categories above or use the search function to find specific businesses.
                                    Each listing includes the exact address, contact details, and distance from your location.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary-500 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    Can I book appointments online through Vellore Directory?
                                </h3>
                                <p className="text-slate-600">
                                    Yes! Many professional services like doctors, dentists, salons, and consultants offer online appointment
                                    booking. Look for the "Book Appointment" button on their business page.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary-500 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    How do I contact businesses via WhatsApp?
                                </h3>
                                <p className="text-slate-600">
                                    Click the WhatsApp button on any business listing to start a direct conversation. You can inquire about
                                    services, prices, availability, or place orders instantly.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary-500 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    Are the business listings verified and up-to-date?
                                </h3>
                                <p className="text-slate-600">
                                    Yes, we regularly verify and update all business information including phone numbers, addresses, operating
                                    hours, and services offered to ensure accuracy.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary-500 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    What areas of Vellore are covered in this directory?
                                </h3>
                                <p className="text-slate-600">
                                    We cover all major areas including Katpadi, Bagayam, Gandhi Nagar, Sathuvachari, Thottapalayam,
                                    Officer's Line, Kosapet, Voorhees, New Town, Old Town, and surrounding localities.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* H6: Most Popular Searches */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Most Popular Searches in Vellore
                        </h2>
                        <p className="text-slate-600 mb-8">
                            What people are searching for in Vellore
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {popularSearches.map((search, index) => (
                                <div key={index} className="bg-slate-50 rounded-xl p-3 border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                                    <h6 className="font-semibold text-sm text-slate-800">
                                        {search}
                                    </h6>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="mb-16">
                        <CTABanner
                            title="Ready to Discover Local Businesses?"
                            description="Join thousands of users finding the best services in Vellore"
                            primaryCTA={{
                                text: "Explore Categories",
                                href: "/categories"
                            }}
                            secondaryCTA={{
                                text: "List Your Business",
                                href: "/contact"
                            }}
                        />
                    </section>

                    {/* SEO Content */}
                    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-card">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">About Vellore Local Business Directory</h2>
                        <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
                            <p>
                                Vellore Directory is your comprehensive guide to discovering and connecting with local businesses
                                in Vellore, Tamil Nadu. Whether you're a resident or visitor, our platform makes it easy to find
                                restaurants, hospitals, shops, services, and more in your neighborhood.
                            </p>
                            <p>
                                With over 500 categories and thousands of verified listings, we help you discover the best that
                                Vellore has to offer. From emergency medical services to weekend dining options, from daily
                                essentials to special occasions – find it all in one place.
                            </p>
                            <p>
                                <strong>Key Features:</strong> Instant WhatsApp connectivity for quick communication, online
                                appointment booking for professional services, verified business information with operating hours
                                and amenities, customer reviews and ratings, and location-based search to find businesses near you.
                            </p>
                        </div>
                    </section>

                    {/* Newsletter Signup */}
                    <section>
                        <NewsletterSignup />
                    </section>
                </main>

                {/* Quick Contact Widget */}
                <QuickContact />
            </div>
        </>
    );
}
