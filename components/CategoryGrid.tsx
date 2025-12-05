import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    color?: string | null;
    businessCount?: number;
}

interface CategoryGridProps {
    categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/near-me/${category.slug}`}
                    className="category-card group"
                >
                    {category.icon && (
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                            {category.icon}
                        </div>
                    )}
                    <h3 className="font-bold text-base text-slate-800 mb-1">
                        {category.name}
                    </h3>
                    {category.businessCount !== undefined && (
                        <p className="text-xs text-slate-500">
                            {category.businessCount} {category.businessCount === 1 ? 'place' : 'places'}
                        </p>
                    )}
                </Link>
            ))}
        </div>
    );
}
