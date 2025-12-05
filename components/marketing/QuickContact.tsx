'use client';

import { Phone, MessageCircle } from 'lucide-react';

interface QuickContactProps {
    phone?: string;
    whatsapp?: string;
    businessName?: string;
}

export function QuickContact({ phone, whatsapp, businessName }: QuickContactProps) {
    const defaultPhone = '+917010650063';
    const defaultWhatsApp = '+917010650063';

    const phoneNumber = phone || defaultPhone;
    const whatsappNumber = whatsapp || defaultWhatsApp;
    const message = businessName
        ? `Hi, I found ${businessName} on Vellore Directory and would like to know more.`
        : 'Hi, I found your business on Vellore Directory and would like to know more.';

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* WhatsApp Button */}
            <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-whatsapp text-white px-4 py-3 rounded-full shadow-clay-elevated hover:shadow-clay-float transition-all hover:scale-105 hover:bg-whatsapp-dark focus-ring"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="hidden group-hover:inline-block font-semibold pr-2 animate-slide-down">
                    Chat on WhatsApp
                </span>
            </a>

            {/* Phone Button */}
            <a
                href={`tel:${phoneNumber}`}
                className="group flex items-center gap-3 bg-primary-600 text-white px-4 py-3 rounded-full shadow-clay-elevated hover:shadow-clay-float transition-all hover:scale-105 hover:bg-primary-700 focus-ring"
                aria-label="Call now"
            >
                <Phone className="w-6 h-6" />
                <span className="hidden group-hover:inline-block font-semibold pr-2 animate-slide-down">
                    Call Now
                </span>
            </a>
        </div>
    );
}
