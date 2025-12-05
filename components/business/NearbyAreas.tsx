import Link from 'lucide-react';

interface NearbyArea {
    name: string;
    slug: string;
    businessCount: number;
    distance?: number;
}

interface NearbyAreasProps {
    areas: NearbyArea[];
    category: string;
}

export default function NearbyAreas({ areas, category }: NearbyAreasProps) {
    if (areas.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {category} in Nearby Areas
            </h3>

            <div className="space-y-2">
                {areas.map((area) => (
                    <a
                        key={area.slug}
                        href={`/near-me/${area.slug}/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <p className="font-medium text-gray-900">{area.name}</p>
                                {area.distance && (
                                    <p className="text-xs text-gray-500">{area.distance.toFixed(1)} km away</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                {area.businessCount} {area.businessCount === 1 ? 'business' : 'businesses'}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
