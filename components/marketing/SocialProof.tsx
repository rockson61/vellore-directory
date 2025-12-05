'use client';

import { useEffect, useState } from 'react';
import { Building2, FolderTree, Users, Star } from 'lucide-react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
}

export function SocialProof() {
    const stats = [
        {
            icon: Building2,
            value: 3799,
            suffix: '+',
            label: 'Businesses Listed',
            color: 'bg-primary-100 text-primary-700',
            textColor: 'text-primary-600'
        },
        {
            icon: FolderTree,
            value: 495,
            suffix: '+',
            label: 'Categories',
            color: 'bg-secondary-100 text-secondary-700',
            textColor: 'text-secondary-600'
        },
        {
            icon: Users,
            value: 10000,
            suffix: '+',
            label: 'Happy Users',
            color: 'bg-accent-100 text-accent-700',
            textColor: 'text-accent-600'
        },
        {
            icon: Star,
            value: 4.49,
            suffix: '',
            label: 'Average Rating',
            color: 'bg-amber-100 text-amber-700',
            textColor: 'text-amber-600'
        },
    ];

    return (
        <div className="clay-card p-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Trusted by Thousands in Vellore
                </h3>
                <p className="text-slate-600">
                    Join our growing community of users and business owners
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                        <div className={`icon-container w-14 h-14 mx-auto mb-3 ${stat.color}`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div className={`text-4xl font-bold mb-2 ${stat.textColor}`}>
                            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
