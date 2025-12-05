import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';

interface LocationSegment {
    location: string;
    locationSlug: string;
    count: number;
}

interface LocationSegmentsProps {
    segments: LocationSegment[];
    categorySlug: string;
}

export default function LocationSegments({ segments, categorySlug }: LocationSegmentsProps) {
    // Group by first letter for better organization
    const groupedSegments = segments.reduce((acc, segment) => {
        const firstLetter = segment.location[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(segment);
        return acc;
    }, {} as Record<string, LocationSegment[]>);

    const sortedLetters = Object.keys(groupedSegments).sort();

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Location</h2>

            <div className="space-y-6">
                {sortedLetters.map((letter) => (
                    <div key={letter}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="font-bold text-purple-600">{letter}</span>
                            </div>
                            <h3 className="font-semibold text-gray-700">{letter}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-10">
                            {groupedSegments[letter].map((segment) => (
                                <Link
                                    key={segment.locationSlug}
                                    href={`/near-me/${segment.locationSlug}/${categorySlug}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors border border-gray-100 hover:border-purple-200 group"
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                                        <span className="text-gray-700 group-hover:text-purple-600 font-medium">
                                            {segment.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">({segment.count})</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
