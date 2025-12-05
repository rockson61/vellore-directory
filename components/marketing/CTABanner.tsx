import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface CTABannerProps {
    title: string;
    description: string;
    primaryCTA: {
        text: string;
        href: string;
    };
    secondaryCTA?: {
        text: string;
        href: string;
    };
    variant?: 'gradient' | 'solid' | 'outlined';
}

export function CTABanner({
    title,
    description,
    primaryCTA,
    secondaryCTA,
    variant = 'gradient'
}: CTABannerProps) {
    const variantClasses = {
        gradient: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-clay-elevated',
        solid: 'bg-primary-600 text-white shadow-clay-elevated',
        outlined: 'bg-white border-2 border-primary-600 text-slate-900 shadow-clay',
    };

    return (
        <div className={`rounded-3xl p-8 md:p-12 ${variantClasses[variant]}`}>
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className={`w-8 h-8 ${variant === 'outlined' ? 'text-primary-600' : 'text-white'}`} />
                </div>
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${variant === 'outlined' ? 'text-slate-900' : 'text-white'}`}>
                    {title}
                </h2>
                <p className={`text-lg md:text-xl mb-8 ${variant === 'outlined' ? 'text-slate-600' : 'text-white/95'}`}>
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={primaryCTA.href}
                        className={`px-8 py-4 rounded-full font-bold text-lg transition-all shadow-clay hover:shadow-clay-float hover:-translate-y-0.5 focus-ring ${variant === 'outlined'
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-white text-primary-700 hover:bg-slate-50'
                            }`}
                    >
                        {primaryCTA.text}
                    </Link>
                    {secondaryCTA && (
                        <Link
                            href={secondaryCTA.href}
                            className={`px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-0.5 focus-ring ${variant === 'outlined'
                                    ? 'border-2 border-primary-600 text-primary-700 hover:bg-primary-50'
                                    : 'border-2 border-white text-white hover:bg-white/10'
                                }`}
                        >
                            {secondaryCTA.text}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
