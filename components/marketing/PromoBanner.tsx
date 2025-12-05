'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';

export function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        // Check if user has dismissed the banner
        const isDismissed = localStorage.getItem('promoBannerDismissed');
        if (isDismissed) {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('promoBannerDismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-[length:200%_100%] animate-gradient text-white overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full">
                    {[...Array(20)].map((_, i) => (
                        <Sparkles
                            key={i}
                            className="absolute animate-pulse-soft"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                width: '16px',
                                height: '16px',
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 md:hidden">
                        <Link
                            href="/business/indira-dental-clinic-dr-rockson-samuel-vellore"
                            className="block"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                                <span className="font-bold text-sm">Best Dental Clinic in Vellore</span>
                            </div>
                            <div className="text-xs leading-tight">
                                <span className="font-semibold">Indira Dental Clinic</span> - Dr Rockson Samuel
                            </div>
                            <div className="mt-1 inline-flex items-center gap-1 bg-yellow-400 text-primary-900 px-2 py-0.5 rounded-full text-xs font-bold animate-bounce">
                                <Sparkles className="w-3 h-3" />
                                20% OFF Implants, Veneers, Invisalign
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex flex-1 items-center justify-center gap-6">
                        <Link
                            href="/business/indira-dental-clinic-dr-rockson-samuel-vellore"
                            className="flex items-center gap-4 hover:scale-105 transition-transform"
                        >
                            <div className="flex items-center gap-2">
                                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                                <div>
                                    <div className="font-bold text-lg flex items-center gap-2">
                                        <span className="bg-yellow-400 text-primary-900 px-3 py-1 rounded-full text-sm animate-pulse">
                                            ⭐ Best in Vellore
                                        </span>
                                    </div>
                                    <div className="text-sm text-white/90">
                                        Indira Dental Clinic | Dr Rockson Samuel
                                    </div>
                                </div>
                            </div>

                            <div className="h-12 w-px bg-white/30" />

                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-400 text-primary-900 px-4 py-2 rounded-full font-bold text-lg animate-bounce shadow-lg">
                                    <Sparkles className="w-5 h-5 inline mr-2" />
                                    20% OFF
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">Dental Implants • Veneers • Invisalign</div>
                                    <div className="text-xs text-white/80">Special NRI Dental Tourism Package</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors focus-ring"
                        aria-label="Dismiss promotional banner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
    );
}
