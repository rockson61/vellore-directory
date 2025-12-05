'use client';

import Link from 'next/link';
import { Home, Search, MapPin, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        404
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-4">
                        Page Not Found
                    </div>
                    <p className="text-slate-600 mt-4 text-lg">
                        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <Link
                        href="/"
                        className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-card hover:shadow-hover transition-all group"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Home className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Go Home</div>
                            <div className="text-sm text-slate-500">Back to homepage</div>
                        </div>
                    </Link>

                    <Link
                        href="/categories"
                        className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-card hover:shadow-hover transition-all group"
                    >
                        <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Search className="w-6 h-6 text-secondary-600" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Browse Categories</div>
                            <div className="text-sm text-slate-500">Find businesses</div>
                        </div>
                    </Link>

                    <Link
                        href="/near-me"
                        className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-card hover:shadow-hover transition-all group"
                    >
                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Near Me</div>
                            <div className="text-sm text-slate-500">Search nearby</div>
                        </div>
                    </Link>
                </div>

                {/* Popular Categories */}
                <div className="bg-white rounded-3xl p-8 shadow-card">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Popular Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { name: 'Restaurants', slug: 'food-and-dining', icon: '🍽️' },
                            { name: 'Healthcare', slug: 'healthcare-and-medical', icon: '🏥' },
                            { name: 'Shopping', slug: 'shopping-and-retail', icon: '🛍️' },
                            { name: 'Education', slug: 'education', icon: '📚' },
                            { name: 'Automotive', slug: 'automotive', icon: '🚗' },
                            { name: 'Home Services', slug: 'home-services', icon: '🏠' },
                            { name: 'Beauty', slug: 'beauty-and-personal-care', icon: '💄' },
                            { name: 'Fitness', slug: 'sports-and-fitness', icon: '💪' },
                        ].map((category) => (
                            <Link
                                key={category.slug}
                                href={`/near-me/${category.slug}`}
                                className="p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-center"
                            >
                                <div className="text-2xl mb-1">{category.icon}</div>
                                <div className="text-sm font-medium text-slate-700">{category.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
