import { Phone, Globe, MapPin, Share2, Bookmark, Clock } from 'lucide-react';
import Link from 'next/link';

interface BusinessHeroProps {
    business: {
        name: string;
        category: string | null;
        location: any;
        rating: string | null;
        totalRatings: number;
        verified: boolean;
        phone: string | null;
        website: string | null;
        latitude: string | null;
        longitude: string | null;
        openingHours?: {
            open_now?: boolean;
            weekday_text?: string[];
        } | null;
    };
}

export default function BusinessHero({ business }: BusinessHeroProps) {
    const isOpen = business.openingHours?.open_now;
    const rating = business.rating ? parseFloat(business.rating) : 0;
    const hasPhone = business.phone && business.phone !== 'N/A';

    // Generate Google Maps directions URL
    const directionsUrl = business.latitude && business.longitude
        ? `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
        : null;

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
                {/* Business Name & Status */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {business.name}
                            </h1>
                            {business.verified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    ✓ Verified
                                </span>
                            )}
                        </div>

                        {/* Category & Location */}
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                            {business.category && (
                                <>
                                    <span className="text-sm font-medium">{business.category}</span>
                                    <span className="text-gray-400">•</span>
                                </>
                            )}
                            {typeof business.location === 'string' && (
                                <span className="text-sm">{business.location}</span>
                            )}
                            {isOpen !== undefined && (
                                <>
                                    <span className="text-gray-400">•</span>
                                    <span className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                        {isOpen ? 'Open Now' : 'Closed'}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Rating */}
                        {rating > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
                                <span className="text-sm text-gray-500">
                                    ({business.totalRatings} {business.totalRatings === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Save business"
                    >
                        <Bookmark className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    {/* Call Now */}
                    {hasPhone && (
                        <a
                            href={`tel:${business.phone}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            Call Now
                        </a>
                    )}

                    {/* Get Directions */}
                    {directionsUrl && (
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors"
                        >
                            <MapPin className="w-5 h-5" />
                            Get Directions
                        </a>
                    )}

                    {/* Visit Website */}
                    {business.website && (
                        <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                        >
                            <Globe className="w-5 h-5" />
                            Visit Website
                        </a>
                    )}

                    {/* Share */}
                    <button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                        aria-label="Share business"
                    >
                        <Share2 className="w-5 h-5" />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
