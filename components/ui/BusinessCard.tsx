'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Business } from '@/lib/schema';

interface BusinessCardProps {
    business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
    const initials = business.name.substring(0, 2).toUpperCase();
    const distance = (Math.random() * 5 + 0.5).toFixed(1); // Mock distance
    // Assuming 'image' and 'rating' might be added to the Business type or derived
    // For now, let's mock them to make the provided JSX syntactically valid.
    const image = business.images?.[0] || null; // Access first image safely
    const rating = business.rating || null; // Assuming business might have a rating property

    return (
        <Link href={`/business/${business.slug || business.id}`} className="block">
            <motion.div
                className="business-card"
                whileHover={{ y: -4 }}
                whileTap={{ y: -2 }}
            >
                <div className="relative h-48 bg-gray-100">
                    {image ? (
                        <img
                            src={image}
                            alt={business.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">🏪</span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                            ⭐ {rating || 'New'}
                        </span>
                    </div>
                </div>
                <div className="w-14 h-14 rounded-clay-md bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold shadow-card flex-shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-text-primary truncate mb-1">
                        {business.name}
                    </div>
                    <div className="text-sm text-text-secondary line-clamp-2">
                        📍 {business.address}
                    </div>
                </div>
                <div className="bg-primary text-white px-2 py-1 rounded-clay-sm text-xs font-bold whitespace-nowrap flex-shrink-0">
                    {distance} km
                </div>
                <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </motion.div>
        </Link>
    );
}
