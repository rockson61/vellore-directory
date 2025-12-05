import { Star, TrendingUp, DollarSign, Award } from 'lucide-react';

interface CategoryInsightsProps {
    insights: {
        averageRating: number;
        totalReviews: number;
        priceRange: string;
        topRatedCount: number;
    };
}

export default function CategoryInsights({ insights }: CategoryInsightsProps) {
    const insightCards = [
        {
            icon: Star,
            label: 'Average Rating',
            value: insights.averageRating.toFixed(1),
            suffix: '⭐',
            color: 'bg-yellow-50 text-yellow-600',
            iconBg: 'bg-yellow-100',
        },
        {
            icon: TrendingUp,
            label: 'Total Reviews',
            value: insights.totalReviews.toLocaleString(),
            suffix: '',
            color: 'bg-blue-50 text-blue-600',
            iconBg: 'bg-blue-100',
        },
        {
            icon: DollarSign,
            label: 'Price Range',
            value: insights.priceRange,
            suffix: '',
            color: 'bg-green-50 text-green-600',
            iconBg: 'bg-green-100',
        },
        {
            icon: Award,
            label: 'Top Rated',
            value: insights.topRatedCount,
            suffix: 'businesses',
            color: 'bg-purple-50 text-purple-600',
            iconBg: 'bg-purple-100',
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Insights</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {insightCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.color} rounded-lg p-4 border border-gray-100`}
                    >
                        <div className={`${card.iconBg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                            <card.icon className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold mb-1">
                            {card.value} {card.suffix && <span className="text-sm font-normal">{card.suffix}</span>}
                        </div>
                        <div className="text-xs font-medium opacity-80">{card.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
