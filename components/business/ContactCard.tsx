'use client';

import { Phone, Globe, Mail, MessageCircle, MapPin, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ContactCardProps {
    business: {
        name: string;
        phone: string | null;
        email: string | null;
        website: string | null;
        whatsappPhone: string | null;
        address: string | null;
    };
}

export default function ContactCard({ business }: ContactCardProps) {
    const [copied, setCopied] = useState(false);
    const hasPhone = business.phone && business.phone !== 'N/A';
    const whatsappNumber = business.whatsappPhone || (hasPhone ? business.phone : null);

    const handleCopy = async () => {
        if (business.phone) {
            await navigator.clipboard.writeText(business.phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="clay-card p-6 sticky top-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>

            <div className="space-y-4">
                {/* Phone */}
                {hasPhone && (
                    <div className="flex items-start gap-3">
                        <div className="icon-container bg-primary-100 text-primary-700">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1 font-medium">Phone</p>
                            <a
                                href={`tel:${business.phone}`}
                                className="text-primary-700 hover:text-primary-800 font-semibold transition-colors"
                            >
                                {business.phone}
                            </a>
                            <button
                                onClick={handleCopy}
                                className="ml-2 text-slate-400 hover:text-slate-600 transition-colors focus-ring rounded p-1"
                                aria-label="Copy phone number"
                            >
                                {copied ? <Check className="w-4 h-4 text-accent-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}

                {/* WhatsApp */}
                {whatsappNumber && whatsappNumber !== 'N/A' && (
                    <div className="flex items-start gap-3">
                        <div className="icon-container bg-green-100 text-green-700">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-2 font-medium">WhatsApp</p>
                            <a
                                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp btn-sm w-full justify-center focus-ring"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                )}

                {/* Email */}
                {business.email && (
                    <div className="flex items-start gap-3">
                        <div className="icon-container bg-blue-100 text-blue-700">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1 font-medium">Email</p>
                            <a
                                href={`mailto:${business.email}`}
                                className="text-primary-700 hover:text-primary-800 break-all text-sm transition-colors"
                            >
                                {business.email}
                            </a>
                        </div>
                    </div>
                )}

                {/* Website */}
                {business.website && (
                    <div className="flex items-start gap-3">
                        <div className="icon-container bg-purple-100 text-purple-700">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1 font-medium">Website</p>
                            <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-700 hover:text-primary-800 break-all text-sm transition-colors"
                            >
                                {business.website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    </div>
                )}

                {/* Address */}
                {business.address && (
                    <div className="flex items-start gap-3">
                        <div className="icon-container bg-amber-100 text-amber-700">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1 font-medium">Address</p>
                            <p className="text-slate-700 text-sm">{business.address}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                    {hasPhone && (
                        <a
                            href={`tel:${business.phone}`}
                            className="btn-danger btn-sm justify-center focus-ring"
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </a>
                    )}
                    {business.website && (
                        <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary btn-sm justify-center focus-ring"
                        >
                            <Globe className="w-4 h-4" />
                            Visit Site
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
