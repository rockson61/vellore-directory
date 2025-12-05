'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Error boundary caught:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Something Went Wrong
                    </div>
                    <p className="text-slate-600 text-lg mb-2">
                        We encountered an unexpected error. Don&apos;t worry, we&apos;re on it!
                    </p>
                    {error.message && (
                        <p className="text-sm text-slate-500 font-mono bg-slate-100 p-3 rounded-xl inline-block">
                            {error.message}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Try Again
                    </button>
                    <Link href="/" className="btn-outline flex items-center justify-center gap-2">
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-12 p-6 bg-slate-50 rounded-2xl">
                    <p className="text-sm text-slate-600">
                        If this problem persists, please{' '}
                        <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                            contact us
                        </Link>
                        {' '}and we&apos;ll help you out.
                    </p>
                </div>
            </div>
        </div>
    );
}
