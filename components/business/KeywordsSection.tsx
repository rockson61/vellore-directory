import { Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface KeywordsSectionProps {
    businessName: string;
    category: string | null;
    location: any;
    types?: string[];
}

export default function KeywordsSection({ businessName, category, location, types }: KeywordsSectionProps) {
    // Generate keywords based on business info
    const keywords = [
        businessName,
        category,
        typeof location === 'string' ? location : null,
        'Vellore',
        ...(types || []),
    ].filter(Boolean);

    // Generate related searches
    const relatedSearches = [
        `${category} in Vellore`,
        `Best ${category} near me`,
        `${category} in ${typeof location === 'string' ? location : 'Vellore'}`,
        `Top rated ${category}`,
    ].filter(Boolean);

    return (
        <div className="clay-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="icon-container bg-purple-100 text-purple-700">
                    <Tag className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Keywords & Tags</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {keywords.slice(0, 10).map((keyword, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors"
                    >
                        {keyword}
                    </span>
                ))}
            </div>

            <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    <h4 className="text-sm font-bold text-slate-900">Related Searches</h4>
                </div>
                <div className="space-y-2">
                    {relatedSearches.map((search, index) => (
                        <Link
                            key={index}
                            href={`/search?q=${encodeURIComponent(search)}`}
                            className="block text-sm text-primary-700 hover:text-primary-800 hover:underline transition-colors"
                        >
                            → {search}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
