import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Category {
    name: string;
    slug: string;
    count: number;
    icon?: string;
}

interface PopularCategoriesProps {
    categories: Category[];
    locationSlug: string;
}

// Category icon mapping
const categoryIcons: Record<string, string> = {
    'Restaurants': '🍽️',
    'Hospitals & Clinics': '🏥',
    'Schools': '🏫',
    'Banks': '🏦',
    'Pharmacies & Medical Supply': '💊',
    'Hotels & Accommodations': '🏨',
    'Shopping': '🛍️',
    'Services': '⚙️',
    'Beauty & Personal Care': '💇',
    'Sports & Fitness': '💪',
};

export default function PopularCategories({ categories, locationSlug }: PopularCategoriesProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
                <Link
                    href="/categories"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                    View All
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => {
                    const icon = categoryIcons[category.name] || '📍';

                    return (
                        <Link
                            key={category.slug}
                            href={`/near-me/${locationSlug}/${category.slug}`}
                            className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all"
                        >
                            <div className="text-3xl mb-2">{icon}</div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {category.count} {category.count === 1 ? 'business' : 'businesses'}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
