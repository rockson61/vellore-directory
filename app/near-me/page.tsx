import Link from 'next/link';
import { Search, MapPin, Navigation, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { categoryHierarchy, locations, businesses } from '@/lib/schema';
import { sql, isNull } from 'drizzle-orm';
import CategoryGrid from '@/components/CategoryGrid';

export const metadata = {
    title: 'Advanced Search | Vellore Directory',
    description: 'Find businesses, services, and places near you in Vellore.',
};

export default async function AdvancedSearchPage() {
    // Fetch top categories with business counts
    const topCategories = await db
        .select({
            id: categoryHierarchy.id,
            name: categoryHierarchy.name,
            slug: categoryHierarchy.slug,
            icon: categoryHierarchy.icon,
            color: categoryHierarchy.color,
            businessCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${businesses} 
                WHERE ${businesses.category} = ${categoryHierarchy.name}
            )`.as('businessCount'),
        })
        .from(categoryHierarchy)
        .where(isNull(categoryHierarchy.parentId))
        .limit(8);

    // Fetch popular locations
    const popularLocations = await db
        .select()
        .from(locations)
        .limit(12);

    return (
        <div className="min-h-screen pb-20">
            <main className="container mx-auto px-4 py-12">
                {/* Search Hero */}
                <div className="gradient-hero rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-slate-900">
                        Find Anything in Vellore
                    </h1>
                    <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
                        Search for businesses, services, and places near you.
                    </p>

                    <div className="bg-white p-2 rounded-2xl shadow-lg max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl">
                            <Search className="w-5 h-5 text-slate-400 mr-3" />
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                className="w-full bg-transparent py-3 outline-none text-slate-900 placeholder-slate-500"
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl">
                            <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Location (e.g., Gandhi Nagar)"
                                className="w-full bg-transparent py-3 outline-none text-slate-900 placeholder-slate-500"
                            />
                        </div>
                        <button className="btn-primary text-sm md:text-base px-8">
                            Search
                        </button>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button className="flex items-center gap-2 bg-white/80 hover:bg-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-soft">
                            <Navigation className="w-4 h-4" />
                            Use my current location
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Browse by Category</h2>
                    <CategoryGrid categories={topCategories} />
                    <div className="text-center mt-8">
                        <Link href="/categories" className="btn-outline">
                            View All Categories
                        </Link>
                    </div>
                </section>

                {/* Locations */}
                <section>
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Popular Locations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {popularLocations.map(location => (
                            <Link
                                key={location.id}
                                href={`/near-me/${location.slug}`}
                                className="bg-white p-4 rounded-xl border border-slate-100 hover:border-primary-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
                                        {location.name}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
