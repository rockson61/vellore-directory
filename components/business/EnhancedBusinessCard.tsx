'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RatingStars } from './RatingStars';
import { QuickActions } from './QuickActions';
import { BadgeCheck, MapPin, Clock, DollarSign } from 'lucide-react';

interface EnhancedBusinessCardProps {
    business: {
        id: number;
        name: string;
        slug: string | null;
        category: string | null;
        address: string | null;
        phone?: string | null;
        whatsappPhone?: string | null;
        rating?: string | null;
        totalRatings?: number | null;
        latitude?: string | null;
        longitude?: string | null;
        verified?: boolean | null;
        priceRange?: string | null;
        image?: string | null;
        openNow?: boolean;
        distance?: number; // in km
    };
    showQuickActions?: boolean;
}

export function EnhancedBusinessCard({ business, showQuickActions = true }: EnhancedBusinessCardProps) {
    const rating = business.rating ? parseFloat(business.rating) : 0;
    const hasRating = rating > 0;

    const getPriceRangeDisplay = (range?: string | null) => {
        if (!range) return null;
        const symbols = { cheap: '₹', moderate: '₹₹', expensive: '₹₹₹' };
        return symbols[range as keyof typeof symbols] || range;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all border border-gray-100 group">
            <Link href={`/business/${business.slug || business.id}`} className="block">
                {/* Header with Image and Title */}
                <div className="flex gap-4 mb-4">
                    {/* Business Image/Logo */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
                        {business.image ? (
                            <Image
                                src={business.image}
                                alt={business.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                                🏢
                            </div>
                        )}
                    </div>

                    {/* Title and Badges */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                {business.name}
                            </h3>

                            {/* Status Badges */}
                            <div className="flex flex-col gap-1 flex-shrink-0">
                                {business.verified && (
                                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                                        <BadgeCheck className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-semibold text-blue-700">Verified</span>
                                    </div>
                                )}

                                {business.openNow !== undefined && (
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${business.openNow
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                        }`}>
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs font-semibold">
                                            {business.openNow ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        {business.category && (
                            <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">
                                {business.category}
                            </p>
                        )}

                        {/* Rating and Price */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {hasRating && (
                                <RatingStars
                                    rating={rating}
                                    totalRatings={business.totalRatings || undefined}
                                    size="sm"
                                />
                            )}

                            {business.priceRange && (
                                <div className="flex items-center gap-1 text-slate-600">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {getPriceRangeDisplay(business.priceRange)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address and Distance */}
                {business.address && (
                    <div className="flex items-start gap-2 mb-4 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="line-clamp-2">{business.address}</p>
                            {business.distance !== undefined && (
                                <p className="text-xs text-slate-500 mt-1">
                                    {business.distance < 1
                                        ? `${(business.distance * 1000).toFixed(0)}m away`
                                        : `${business.distance.toFixed(1)}km away`
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Link>

            {/* Quick Actions */}
            {showQuickActions && (
                <QuickActions
                    phone={business.phone}
                    whatsapp={business.whatsappPhone}
                    businessName={business.name}
                    address={business.address || ''}
                    latitude={business.latitude}
                    longitude={business.longitude}
                />
            )}
        </div>
    );
}
