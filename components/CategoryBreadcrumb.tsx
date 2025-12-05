import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface CategoryBreadcrumbProps {
    items: {
        name: string;
        slug: string;
        id: number;
    }[];
}

export default function CategoryBreadcrumb({ items }: CategoryBreadcrumbProps) {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </Link>
                </li>
                <li>
                    <div className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link href="/categories" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                            Categories
                        </Link>
                    </div>
                </li>
                {items.map((item, index) => (
                    <li key={item.id}>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <Link
                                href={`/near-me/${item.slug}`}
                                className={`ml-1 text-sm font-medium md:ml-2 ${index === items.length - 1
                                    ? 'text-gray-500 pointer-events-none'
                                    : 'text-gray-700 hover:text-blue-600'
                                    }`}
                                aria-current={index === items.length - 1 ? 'page' : undefined}
                            >
                                {item.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
