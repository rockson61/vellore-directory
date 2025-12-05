import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface OpeningHoursProps {
    openingHours: any;
}

export default function OpeningHours({ openingHours }: OpeningHoursProps) {
    if (!openingHours || !openingHours.weekday_text) {
        return null;
    }

    const isOpen = openingHours.open_now || false;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDay = now.getDay();

    return (
        <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`icon-container ${isOpen ? 'bg-accent-100 text-accent-700' : 'bg-red-100 text-red-700'}`}>
                        <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Opening Hours</h3>
                </div>
                {isOpen ? (
                    <span className="badge badge-success flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Open Now
                    </span>
                ) : (
                    <span className="badge badge-danger flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Closed
                    </span>
                )}
            </div>

            <div className="space-y-2">
                {openingHours.weekday_text.map((dayText: string, index: number) => {
                    const isToday = index === currentDay;
                    return (
                        <div
                            key={index}
                            className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${isToday
                                    ? 'bg-primary-50 border border-primary-200'
                                    : 'hover:bg-slate-50'
                                }`}
                        >
                            <span className={`font-medium ${isToday ? 'text-primary-800' : 'text-slate-700'}`}>
                                {days[index]}
                            </span>
                            <span className={`text-sm ${isToday ? 'text-primary-700 font-semibold' : 'text-slate-600'}`}>
                                {dayText.split(': ')[1] || dayText}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
