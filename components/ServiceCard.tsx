'use client';

import { Clock, IndianRupee } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    description?: string | null;
    durationMinutes: number;
    price?: string | number | null;
    isBookable?: boolean | null;
}

interface ServiceCardProps {
    service: Service;
    onBook?: (service: Service) => void;
}

export default function ServiceCard({ service, onBook }: ServiceCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h4>
                    {service.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{service.durationMinutes} mins</span>
                        </div>
                        {service.price && (
                            <div className="flex items-center font-medium text-gray-900">
                                <IndianRupee className="w-4 h-4 mr-0.5" />
                                <span>{service.price}</span>
                            </div>
                        )}
                    </div>
                </div>

                {service.isBookable && onBook && (
                    <button
                        onClick={() => onBook(service)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0 ml-4"
                    >
                        Book
                    </button>
                )}
            </div>
        </div>
    );
}
