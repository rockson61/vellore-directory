import { Info, TrendingUp, MapPin } from 'lucide-react';

interface LocationAboutProps {
    location: string;
    stats: {
        totalBusinesses: number;
        topCategories: string[];
        verified: number;
    };
}

export default function LocationAbout({ location, stats }: LocationAboutProps) {
    // Auto-generate description
    const description = `${location} is a vibrant area in Vellore with ${stats.totalBusinesses} businesses serving the local community. Popular categories include ${stats.topCategories.slice(0, 3).join(', ')}${stats.topCategories.length > 3 ? ', and more' : ''}.`;

    const highlights = [
        `${stats.totalBusinesses}+ verified business listings`,
        `Popular for ${stats.topCategories[0] || 'various services'}`,
        `${stats.verified} verified businesses ensure quality`,
        'Complete contact information with phone numbers',
        'Customer reviews and ratings available',
        'Opening hours and location details',
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Info className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">About {location}</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
                {description}
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Why Choose Businesses in {location}?
                </h3>
                <ul className="space-y-2">
                    {highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span>{highlight}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Popular Searches */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Popular Searches in {location}</h3>
                <div className="flex flex-wrap gap-2">
                    {stats.topCategories.map((category, index) => (
                        <a
                            key={index}
                            href={`/search?q=${encodeURIComponent(`${category} in ${location}`)}`}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                            {category} in {location}
                        </a>
                    ))}
                    <a
                        href={`/search?q=${encodeURIComponent(`${location} near me`)}`}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                        {location} near me
                    </a>
                </div>
            </div>
        </div>
    );
}
