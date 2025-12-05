'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface AmenityGroup {
    type: string;
    label: string;
    amenities: string[];
}

interface AmenitiesFilterProps {
    amenityGroups: AmenityGroup[];
    selectedAmenities: string[];
    onChange: (selected: string[]) => void;
}

export default function AmenitiesFilter({
    amenityGroups,
    selectedAmenities,
    onChange,
}: AmenitiesFilterProps) {
    const toggleAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            onChange(selectedAmenities.filter((a) => a !== amenity));
        } else {
            onChange([...selectedAmenities, amenity]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Amenities</h3>

            <div className="space-y-6">
                {amenityGroups.map((group) => (
                    <div key={group.type}>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            {group.label}
                        </h4>
                        <div className="space-y-2">
                            {group.amenities.map((amenity) => (
                                <label
                                    key={amenity}
                                    className="flex items-center space-x-3 cursor-pointer group"
                                >
                                    <div
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(amenity)
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 group-hover:border-blue-400'
                                            }`}
                                    >
                                        {selectedAmenities.includes(amenity) && (
                                            <Check className="w-3.5 h-3.5 text-white" />
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selectedAmenities.includes(amenity)}
                                        onChange={() => toggleAmenity(amenity)}
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        {amenity}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
