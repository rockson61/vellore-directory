'use client';

import Link from 'next/link';

interface CategoryCardProps {
    name: string;
    slug: string;
    count?: number | null;
    icon?: string | null;
    color?: string | null;
}

export function CategoryCard({ name, slug, count, icon, color }: CategoryCardProps) {
    return (
        <Link href={`/near-me/${slug}`}>
            <div
                className="category-card group"
                style={{
                    backgroundColor: color ? `${color}15` : undefined,
                }}
            >
                {icon && (
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                )}
                <h3 className="font-bold text-base text-slate-800 mb-1">
                    {name}
                </h3>
                {count !== null && count !== undefined && (
                    <p className="text-xs text-slate-500">
                        {count} {count === 1 ? 'place' : 'places'}
                    </p>
                )}
            </div>
        </Link>
    );
}
