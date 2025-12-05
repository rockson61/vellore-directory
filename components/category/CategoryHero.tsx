import { Search } from 'lucide-react';

interface CategoryHeroProps {
    category: {
        name: string;
        icon?: string;
        description?: string;
    };
    stats: {
        totalBusinesses: number;
        locations: number;
    };
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

export default function CategoryHero({ category, stats }: CategoryHeroProps) {
    const icon = categoryIcons[category.name] || '📍';
    const description = category.description || `Find the best ${category.name} in Vellore. Browse verified listings with ratings, reviews, phone numbers, and addresses.`;

    return (
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Category Info */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl">{icon}</div>
                    <div>
                        <h1 className="text-4xl font-bold">{category.name}</h1>
                        <p className="text-purple-100 text-lg mt-2">{description}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                        <span className="font-bold text-2xl">{stats.totalBusinesses}</span>
                        <span className="text-sm ml-2">Businesses</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                        <span className="font-bold text-2xl">{stats.locations}</span>
                        <span className="text-sm ml-2">Locations</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Search ${category.name}...`}
                            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
