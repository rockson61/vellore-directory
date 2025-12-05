'use client';

interface RatingStarsProps {
    rating: number; // 0-5
    totalRatings?: number;
    size?: 'sm' | 'md' | 'lg';
    showNumber?: boolean;
}

export function RatingStars({
    rating,
    totalRatings,
    size = 'md',
    showNumber = true
}: RatingStarsProps) {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <svg
                key={`full-${i}`}
                className={`${sizeClasses[size]} text-yellow-400 fill-current`}
                viewBox="0 0 20 20"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        );
    }

    // Half star
    if (hasHalfStar) {
        stars.push(
            <svg
                key="half"
                className={`${sizeClasses[size]} text-yellow-400`}
                viewBox="0 0 20 20"
            >
                <defs>
                    <linearGradient id="half-fill">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#half-fill)"
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
                <path
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
            </svg>
        );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <svg
                key={`empty-${i}`}
                className={`${sizeClasses[size]} text-gray-300`}
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {stars}
            </div>
            {showNumber && (
                <span className={`${textSizeClasses[size]} font-semibold text-slate-700`}>
                    {rating.toFixed(1)}
                </span>
            )}
            {totalRatings && totalRatings > 0 && (
                <span className={`${textSizeClasses[size]} text-slate-500`}>
                    ({totalRatings.toLocaleString()})
                </span>
            )}
        </div>
    );
}
