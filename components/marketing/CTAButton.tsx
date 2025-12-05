import Link from 'next/link';

interface CTAButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    icon?: React.ReactNode;
}

export function CTAButton({
    href,
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon
}: CTAButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl',
        secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-lg',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <Link
            href={href}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {icon && <span>{icon}</span>}
            {children}
        </Link>
    );
}
