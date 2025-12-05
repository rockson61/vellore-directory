'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 5000);
        }, 1000);
    };

    return (
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white shadow-clay-elevated">
            <div className="max-w-2xl mx-auto text-center">
                <div className="icon-container w-16 h-16 bg-white/20 text-white mx-auto mb-4">
                    <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    Stay Updated with Vellore Directory
                </h3>
                <p className="text-white/95 mb-6 text-lg">
                    Get the latest business listings, offers, and updates delivered to your inbox
                </p>

                {status === 'success' ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 animate-fade-in">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-white font-semibold text-lg">
                            ✓ Successfully subscribed! Check your inbox.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="flex-1 px-6 py-4 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-clay"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="px-8 py-4 bg-white text-primary-700 font-bold rounded-full hover:bg-slate-50 transition-all shadow-clay hover:shadow-clay-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed focus-ring whitespace-nowrap"
                        >
                            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                        </button>
                    </form>
                )}

                <p className="text-sm text-white/80">
                    🔒 We respect your privacy. Unsubscribe anytime.
                </p>
            </div>
        </div>
    );
}
