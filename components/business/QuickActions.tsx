'use client';

import { Phone, MessageCircle, Navigation, Share2 } from 'lucide-react';

interface QuickActionsProps {
    phone?: string | null;
    whatsapp?: string | null;
    businessName: string;
    address: string;
    latitude?: string | null;
    longitude?: string | null;
}

export function QuickActions({
    phone,
    whatsapp,
    businessName,
    address,
    latitude,
    longitude,
}: QuickActionsProps) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: businessName,
                    text: `Check out ${businessName} on Vellore Directory`,
                    url: window.location.href,
                });
            } catch (err) {
                // User cancelled or share failed
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const getDirectionsUrl = () => {
        if (latitude && longitude) {
            return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    };

    const getWhatsAppUrl = () => {
        const number = (whatsapp || phone || '').replace(/[^0-9]/g, '');
        const message = `Hi, I found ${businessName} on Vellore Directory and would like to know more.`;
        return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="flex gap-2">
            {/* Call Button */}
            {phone && (
                <a
                    href={`tel:${phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">Call</span>
                </a>
            )}

            {/* WhatsApp Button */}
            {(whatsapp || phone) && (
                <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                </a>
            )}

            {/* Directions Button */}
            <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
                <Navigation className="w-4 h-4" />
                <span className="hidden md:inline">Directions</span>
            </a>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
                <Share2 className="w-4 h-4" />
            </button>
        </div>
    );
}
