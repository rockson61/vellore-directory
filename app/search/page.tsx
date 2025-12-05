'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BusinessCard } from '@/components/ui/BusinessCard';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchBar } from '@/components/search/SearchBar';
import type { Business } from '@/lib/schema';

interface SearchResponse {
    results: Business[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
    });

    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const rating = searchParams.get('rating') || '';
    const sort = searchParams.get('sort') || 'recommended';
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (query) params.set('q', query);
                if (category) params.set('category', category);
                if (location) params.set('location', location);
                if (rating) params.set('rating', rating);
                params.set('limit', '20');
                params.set('offset', ((page - 1) * 20).toString());

                const response = await fetch(`/api/search?${params.toString()}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }

                const data: SearchResponse = await response.json();
                setResults(data.results);
                setPagination(data.pagination);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, category, location, rating, sort, page]);

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header with Search Bar */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Businesses</h1>
                    <SearchBar />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <span className="hover:text-primary cursor-pointer">Home</span>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900 font-medium">Search Results</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <SearchFilters
                            categories={[
                                // These should ideally come from an API, but for now we'll use static data
                                { name: 'Restaurants', slug: 'restaurants' },
                                { name: 'Shopping', slug: 'shopping' },
                                { name: 'Services', slug: 'services' },
                                { name: 'Healthcare', slug: 'healthcare' },
                                { name: 'Education', slug: 'education' },
                            ]}
                            locations={[
                                { name: 'Katpadi', slug: 'katpadi' },
                                { name: 'Gandhi Nagar', slug: 'gandhi-nagar' },
                                { name: 'Sathuvachari', slug: 'sathuvachari' },
                                { name: 'Thottapalayam', slug: 'thottapalayam' },
                            ]}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {loading ? 'Searching...' : `${pagination.total} Results Found`}
                                </h2>
                                {query && (
                                    <p className="text-sm text-gray-600">
                                        for "<span className="font-semibold text-gray-900">{query}</span>"
                                    </p>
                                )}
                            </div>
                            {category && (
                                <p className="text-sm text-gray-600">
                                    Category: <span className="font-semibold text-gray-900">{category}</span>
                                </p>
                            )}
                            {location && (
                                <p className="text-sm text-gray-600">
                                    Location: <span className="font-semibold text-gray-900">{location}</span>
                                </p>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                                        <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                                <span className="text-4xl mb-4 block">⚠️</span>
                                <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Results</h3>
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && results.length === 0 && (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                <span className="text-6xl mb-4 block">🔍</span>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h3>
                                <p className="text-gray-600 mb-6">
                                    We couldn't find any businesses matching your search criteria.
                                </p>
                                <div className="text-sm text-gray-500">
                                    <p className="mb-2">Try:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Using different keywords</li>
                                        <li>Removing some filters</li>
                                        <li>Checking your spelling</li>
                                        <li>Searching for a broader category</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Results Grid */}
                        {!loading && !error && results.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {results.map((business) => (
                                        <BusinessCard key={business.id} business={business} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.set('page', (page - 1).toString());
                                                window.location.href = `/search?${params.toString()}`;
                                            }}
                                            disabled={page === 1}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            ← Previous
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => {
                                                            const params = new URLSearchParams(searchParams.toString());
                                                            params.set('page', pageNum.toString());
                                                            window.location.href = `/search?${params.toString()}`;
                                                        }}
                                                        className={`w-10 h-10 rounded-lg font-medium transition-all ${page === pageNum
                                                                ? 'bg-primary text-white shadow-md'
                                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.set('page', (page + 1).toString());
                                                window.location.href = `/search?${params.toString()}`;
                                            }}
                                            disabled={page === totalPages}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}

                                {/* Results Summary */}
                                <p className="text-center text-sm text-gray-600 mt-4">
                                    Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} results
                                </p>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
