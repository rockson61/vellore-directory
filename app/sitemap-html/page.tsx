import Link from 'next/link';
import { db } from '@/lib/db';
import { categoryHierarchy, locations, businesses } from '@/lib/schema';
import { isNull, sql } from 'drizzle-orm';

export const metadata = {
    title: 'Sitemap - Vellore Directory',
    description: 'Browse all pages and categories in Vellore Directory',
};

export default async function SitemapPage() {
    // Fetch all root categories with business counts
    const rootCategories = await db
        .select({
            id: categoryHierarchy.id,
            name: categoryHierarchy.name,
            slug: categoryHierarchy.slug,
            businessCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${businesses} 
                WHERE ${businesses.category} = ${categoryHierarchy.name}
            )`.as('businessCount'),
        })
        .from(categoryHierarchy)
        .where(isNull(categoryHierarchy.parentId));

    // Fetch all locations
    const allLocations = await db
        .select()
        .from(locations);

    return (
        <div className="min-h-screen pb-12">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Sitemap</h1>
                <p className="text-slate-600 mb-12">Browse all pages and categories in Vellore Directory</p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Main Pages */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Main Pages</h2>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Search
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    All Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/near-me" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Near Me
                                </Link>
                            </li>
                            <li>
                                <Link href="/appointments" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Book Appointment
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </section>

                    {/* Categories */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Categories</h2>
                        <ul className="space-y-3">
                            {rootCategories.map(category => (
                                <li key={category.id}>
                                    <Link
                                        href={`/near-me/${category.slug}`}
                                        className="text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        {category.name}
                                        {category.businessCount > 0 && (
                                            <span className="text-slate-500 text-sm ml-2">
                                                ({category.businessCount} {category.businessCount === 1 ? 'place' : 'places'})
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Locations */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Locations</h2>
                        <ul className="space-y-3">
                            {allLocations.map(location => (
                                <li key={location.id}>
                                    <Link
                                        href={`/near-me/${location.slug}`}
                                        className="text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        {location.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
