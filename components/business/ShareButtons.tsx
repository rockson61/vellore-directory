'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle, Check } from 'lucide-react';

interface ShareButtonsProps {
    businessName: string;
    url: string;
}

export default function ShareButtons({ businessName, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareText = `Check out ${businessName} on Vellore Directory`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
            color: 'bg-whatsapp hover:bg-whatsapp-dark text-white',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
            color: 'bg-sky-500 hover:bg-sky-600 text-white',
        },
    ];

    return (
        <div className="clay-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="icon-container bg-primary-100 text-primary-700">
                    <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Share this Business</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-clay hover:shadow-clay-hover hover:-translate-y-0.5 focus-ring ${link.color}`}
                    >
                        <link.icon className="w-5 h-5" />
                        <span className="text-sm">{link.name}</span>
                    </a>
                ))}

                <button
                    onClick={handleCopyLink}
                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-800 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300 shadow-clay hover:shadow-clay-hover hover:-translate-y-0.5 focus-ring"
                >
                    {copied ? (
                        <>
                            <Check className="w-5 h-5 text-accent-600" />
                            <span className="text-sm">Link Copied!</span>
                        </>
                    ) : (
                        <>
                            <LinkIcon className="w-5 h-5" />
                            <span className="text-sm">Copy Link</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
