'use client';

interface Breadcrumb {
    name: string;
    href: string;
}

interface BreadcrumbsProps {
    items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-slate-600">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        {index > 0 && (
                            <svg
                                className="w-4 h-4 mx-2 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        )}
                        {index === items.length - 1 ? (
                            <span className="font-medium text-slate-900" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <a
                                href={item.href}
                                className="hover:text-primary-600 transition-colors"
                            >
                                {item.name}
                            </a>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
