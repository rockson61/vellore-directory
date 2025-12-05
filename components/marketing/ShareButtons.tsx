'use client';

import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);
    const shareDescription = encodeURIComponent(description || '');

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Share:</span>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-5 h-5" />
            </a>

            {/* Twitter */}
            <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                aria-label="Share on Twitter"
            >
                <Twitter className="w-5 h-5" />
            </a>

            {/* LinkedIn */}
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="w-5 h-5" />
            </a>

            {/* Copy Link */}
            <button
                onClick={copyToClipboard}
                className={`w-10 h-10 rounded-full ${copied ? 'bg-green-500' : 'bg-slate-200'
                    } text-slate-700 flex items-center justify-center hover:bg-slate-300 transition-colors`}
                aria-label="Copy link"
            >
                {copied ? (
                    <span className="text-white text-xs font-bold">✓</span>
                ) : (
                    <LinkIcon className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
