import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';

interface NearbyLocation {
    name: string;
    slug: string;
    businessCount: number;
    distance?: number;
}

interface NearbyLocationsProps {
    locations: NearbyLocation[];
}

export default function NearbyLocations({ locations }: NearbyLocationsProps) {
    if (locations.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Navigation className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Nearby Areas</h2>
            </div>

            <div className="space-y-3">
                {locations.map((location) => (
                    <Link
                        key={location.slug}
                        href={`/near-me/${location.slug}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{location.name}</h3>
                                {location.distance && (
                                    <p className="text-xs text-gray-500">{location.distance.toFixed(1)} km away</p>
                                )}
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            {location.businessCount} {location.businessCount === 1 ? 'business' : 'businesses'}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
