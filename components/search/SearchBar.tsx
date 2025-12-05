'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        if (location) params.set('location', location);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-full shadow-clay-elevated border border-slate-200">
                <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-full">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search for shops, services..."
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-full">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Location (e.g. Katpadi)"
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-slate-800 placeholder-slate-400"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary px-8 py-3 focus-ring whitespace-nowrap"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
