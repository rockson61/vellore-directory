import { Building2, Star, CheckCircle, Sparkles } from 'lucide-react';

interface LocationStatsProps {
    stats: {
        totalBusinesses: number;
        topRated: number;
        newListings: number;
        verified: number;
    };
}

export default function LocationStats({ stats }: LocationStatsProps) {
    const statCards = [
        {
            icon: Building2,
            label: 'Total Businesses',
            value: stats.totalBusinesses,
            color: 'bg-blue-50 text-blue-600',
            iconBg: 'bg-blue-100',
        },
        {
            icon: Star,
            label: 'Top Rated (4+ ⭐)',
            value: stats.topRated,
            color: 'bg-yellow-50 text-yellow-600',
            iconBg: 'bg-yellow-100',
        },
        {
            icon: Sparkles,
            label: 'New Listings',
            value: stats.newListings,
            color: 'bg-green-50 text-green-600',
            iconBg: 'bg-green-100',
        },
        {
            icon: CheckCircle,
            label: 'Verified',
            value: stats.verified,
            color: 'bg-purple-50 text-purple-600',
            iconBg: 'bg-purple-100',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className={`${stat.color} rounded-xl p-6 border border-gray-100`}
                >
                    <div className={`${stat.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium opacity-80">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
