import { MapPin, Navigation } from 'lucide-react';

interface GoogleMapEmbedProps {
    latitude: number;
    longitude: number;
    businessName: string;
}

export default function GoogleMapEmbed({ latitude, longitude, businessName }: GoogleMapEmbedProps) {
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=15`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    return (
        <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="icon-container bg-red-100 text-red-700">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Location</h3>
                </div>
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 transition-colors focus-ring rounded px-2 py-1"
                >
                    <Navigation className="w-4 h-4" />
                    Directions
                </a>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-clay-sm">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map showing location of ${businessName}`}
                    className="w-full h-full"
                />
            </div>

            <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full mt-4 justify-center focus-ring"
            >
                <Navigation className="w-5 h-5" />
                Get Directions
            </a>
        </div>
    );
}
