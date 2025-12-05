import Link from 'next/link';
import { Star, MapPin, Phone } from 'lucide-react';

interface Business {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    rating: string | null;
    totalRatings: number;
    address: string | null;
    phone: string | null;
    images: string[] | null;
}

interface TopRatedBusinessesProps {
    businesses: Business[];
}

export default function TopRatedBusinesses({ businesses }: TopRatedBusinessesProps) {
    if (businesses.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <h2 className="text-2xl font-bold text-gray-900">Top Rated</h2>
            </div>

            <div className="space-y-4">
                {businesses.map((business, index) => {
                    const rating = business.rating ? parseFloat(business.rating) : 0;
                    const mainPhoto = business.images?.[0];

                    return (
                        <Link
                            key={business.id}
                            href={`/business/${business.slug}`}
                            className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                        >
                            {/* Rank Badge */}
                            <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-orange-600' :
                                                'bg-gray-300'
                                    }`}>
                                    {index + 1}
                                </div>
                            </div>

                            {/* Photo */}
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                {mainPhoto ? (
                                    <img
                                        src={mainPhoto}
                                        alt={business.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate mb-1">
                                    {business.name}
                                </h3>

                                {business.category && (
                                    <p className="text-sm text-gray-500 mb-2">{business.category}</p>
                                )}

                                <div className="flex items-center gap-3 text-sm">
                                    {rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
                                            <span className="text-gray-500">({business.totalRatings})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <Link
                href="#all-businesses"
                className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
                View All Businesses →
            </Link>
        </div>
    );
}
