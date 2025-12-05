interface RelatedLink {
    name: string;
    href: string;
    count?: number;
}

interface RelatedLinksProps {
    title: string;
    links: RelatedLink[];
    variant?: 'categories' | 'locations' | 'businesses';
}

export function RelatedLinks({ title, links, variant = 'categories' }: RelatedLinksProps) {
    const getIcon = () => {
        switch (variant) {
            case 'categories':
                return '📁';
            case 'locations':
                return '📍';
            case 'businesses':
                return '🏢';
            default:
                return '🔗';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>{getIcon()}</span>
                {title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                    >
                        <span className="text-sm font-medium text-slate-700 group-hover:text-primary-700">
                            {link.name}
                        </span>
                        {link.count !== undefined && (
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                {link.count}
                            </span>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
}
