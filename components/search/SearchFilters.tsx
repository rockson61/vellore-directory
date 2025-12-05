'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SearchFiltersProps {
    categories: { name: string; slug: string; count?: number }[];
    locations: { name: string; slug: string }[];
}

export function SearchFilters({ categories, locations }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');

    // Update state when URL params change
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || '');
        setSelectedRating(searchParams.get('rating') || '');
        setSortBy(searchParams.get('sort') || 'recommended');
    }, [searchParams]);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset page when filtering
        params.delete('page');

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            {/* Sort By */}
            <div>
                <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
                <select
                    value={sortBy}
                    onChange={(e) => updateFilters('sort', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Added</option>
                </select>
            </div>

            {/* Categories */}
            <div>
                <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            value=""
                            checked={selectedCategory === ''}
                            onChange={() => updateFilters('category', '')}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                            All Categories
                        </span>
                    </label>
                    {categories.map((category) => (
                        <label key={category.slug} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={category.name}
                                checked={selectedCategory === category.name}
                                onChange={() => updateFilters('category', category.name)}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                                {category.name}
                            </span>
                            {category.count !== undefined && (
                                <span className="ml-auto text-xs text-gray-400">
                                    {category.count}
                                </span>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div>
                <h3 className="font-bold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                    {[4, 3, 2].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                value={rating.toString()}
                                checked={selectedRating === rating.toString()}
                                onChange={() => updateFilters('rating', rating.toString())}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                                    {rating}+ Stars
                                </span>
                                <div className="flex text-yellow-400 text-xs">
                                    {'★'.repeat(rating)}
                                    {'☆'.repeat(5 - rating)}
                                </div>
                            </div>
                        </label>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="rating"
                            value=""
                            checked={selectedRating === ''}
                            onChange={() => updateFilters('rating', '')}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                            Any Rating
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}
