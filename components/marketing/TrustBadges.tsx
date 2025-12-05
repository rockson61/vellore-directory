import { Shield, CheckCircle, Users, TrendingUp } from 'lucide-react';

const TRUST_BADGES = [
    {
        icon: Shield,
        label: 'Verified Listings',
        description: 'All businesses verified',
        color: 'bg-primary-100 text-primary-700'
    },
    {
        icon: CheckCircle,
        label: 'Accurate Info',
        description: 'Updated regularly',
        color: 'bg-accent-100 text-accent-700'
    },
    {
        icon: Users,
        label: '10,000+ Users',
        description: 'Trusted community',
        color: 'bg-secondary-100 text-secondary-700'
    },
    {
        icon: TrendingUp,
        label: 'Growing Daily',
        description: 'New listings added',
        color: 'bg-blue-100 text-blue-700'
    },
];

export function TrustBadges() {
    return (
        <div className="clay-card p-8">
            <h3 className="text-center text-xl font-bold text-slate-900 mb-6">
                Why Trust Vellore Directory?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {TRUST_BADGES.map((badge, index) => (
                    <div key={index} className="text-center">
                        <div className={`icon-container w-16 h-16 mx-auto mb-3 ${badge.color}`}>
                            <badge.icon className="w-8 h-8" />
                        </div>
                        <div className="font-bold text-slate-900 mb-1">{badge.label}</div>
                        <div className="text-sm text-slate-600">{badge.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
