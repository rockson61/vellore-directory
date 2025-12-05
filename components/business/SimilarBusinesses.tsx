import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

interface SimilarBusiness {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    rating: string | null;
    totalRatings: number;
    address: string | null;
    images: string[] | null;
}

interface SimilarBusinessesProps {
    businesses: SimilarBusiness[];
    currentBusinessId: number;
    location: string;
    category: string;
}

export default function SimilarBusinesses({ businesses, currentBusinessId, location, category }: SimilarBusinessesProps) {
    // Filter out current business and limit to 6
    const similar = businesses
        .filter(b => b.id !== currentBusinessId)
        .slice(0, 6);

    if (similar.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Similar {category} in {location}
            </h3>

            <div className="space-y-4">
                {similar.map((business) => {
                    const rating = business.rating ? parseFloat(business.rating) : 0;
                    const mainPhoto = business.images?.[0];

                    return (
                        <Link
                            key={business.id}
                            href={`/business/${business.slug}`}
                            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                        >
                            {/* Photo */}
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
                                <h4 className="font-medium text-gray-900 truncate mb-1">
                                    {business.name}
                                </h4>

                                {rating > 0 && (
                                    <div className="flex items-center gap-1 mb-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
                                        <span className="text-sm text-gray-500">({business.totalRatings})</span>
                                    </div>
                                )}

                                {business.address && (
                                    <div className="flex items-start gap-1 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{business.address}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <Link
                href={`/near-me/${location.toLowerCase().replace(/\s+/g, '-')}/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
                View all {category} in {location} →
            </Link>
        </div>
    );
}
