'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
    photos: string[] | null;
    businessName: string;
}

export default function PhotoGallery({ photos, businessName }: PhotoGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!photos || photos.length === 0) {
        return (
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No photos available</p>
                </div>
            </div>
        );
    }

    const mainPhoto = photos[0];
    const thumbnails = photos.slice(1, 5);

    return (
        <>
            <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden">
                {/* Main Photo */}
                <div
                    className="col-span-2 row-span-2 relative h-96 cursor-pointer group"
                    onClick={() => setSelectedIndex(0)}
                >
                    <Image
                        src={mainPhoto}
                        alt={`${businessName} - Main photo`}
                        fill
                        className="object-cover group-hover:opacity-90 transition-opacity"
                    />
                </div>

                {/* Thumbnail Photos */}
                {thumbnails.map((photo, index) => (
                    <div
                        key={index}
                        className="relative h-48 cursor-pointer group"
                        onClick={() => setSelectedIndex(index + 1)}
                    >
                        <Image
                            src={photo}
                            alt={`${businessName} - Photo ${index + 2}`}
                            fill
                            className="object-cover group-hover:opacity-90 transition-opacity"
                        />
                        {index === 3 && photos.length > 5 && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">
                                    +{photos.length - 5} more
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={() => setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1)}
                        className="absolute left-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
                        <Image
                            src={photos[selectedIndex]}
                            alt={`${businessName} - Photo ${selectedIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={() => setSelectedIndex(selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0)}
                        className="absolute right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
                        {selectedIndex + 1} / {photos.length}
                    </div>
                </div>
            )}
        </>
    );
}
