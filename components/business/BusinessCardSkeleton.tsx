export function BusinessCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 animate-pulse">
            {/* Header with Image and Title */}
            <div className="flex gap-4 mb-4">
                {/* Image Skeleton */}
                <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-slate-200" />

                {/* Title and Badges Skeleton */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                            <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                        </div>
                        <div className="w-16 h-6 bg-slate-200 rounded-lg" />
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-24 mt-3" />
                </div>
            </div>

            {/* Address Skeleton */}
            <div className="flex gap-2 mb-4">
                <div className="w-4 h-4 bg-slate-200 rounded mt-0.5" />
                <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="flex gap-2">
                <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
                <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}
