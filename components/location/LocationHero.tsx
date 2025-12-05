import { Search, MapPin, TrendingUp } from 'lucide-react';

interface LocationHeroProps {
    location: {
        name: string;
        pincode: string;
    };
    stats: {
        totalBusinesses: number;
        topRated: number;
        verified: number;
    };
}

export default function LocationHero({ location, stats }: LocationHeroProps) {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Location Info */}
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-8 h-8" />
                    <div>
                        <h1 className="text-4xl font-bold">{location.name}</h1>
                        <p className="text-blue-100 text-lg">Vellore, Tamil Nadu - {location.pincode}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="font-bold text-2xl">{stats.totalBusinesses}</span>
                            <span className="text-sm ml-2">Businesses</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="font-bold text-2xl">{stats.topRated}</span>
                            <span className="text-sm ml-2">Top Rated</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="font-bold text-2xl">{stats.verified}</span>
                            <span className="text-sm ml-2">Verified</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Search businesses in ${location.name}...`}
                            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
