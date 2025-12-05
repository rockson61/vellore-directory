'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, MapPin, Home, Grid, Info, Mail } from 'lucide-react';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Categories', href: '/categories', icon: Grid },
        { name: 'Near Me', href: '/near-me', icon: MapPin },
        { name: 'About', href: '/about', icon: Info },
        { name: 'Contact', href: '/contact', icon: Mail },
    ];

    return (
        <header className="glass-header">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-extrabold leading-none">
                                <span className="text-slate-800">Vellore</span>
                                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Directory</span>
                            </h1>
                            <p className="text-xs text-slate-500">Find Local Businesses</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="search-box w-full">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search businesses, services..."
                                className="flex-1 ml-3 outline-none text-sm bg-transparent"
                            />
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link href="/contact" className="btn-primary text-sm">
                            List Your Business
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Search Bar */}
                <div className="lg:hidden pb-3">
                    <div className="search-box w-full">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 ml-3 outline-none text-sm bg-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white animate-slide-down">
                    <nav className="container mx-auto px-4 py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full mt-4"
                        >
                            <button className="btn-primary w-full text-sm">
                                List Your Business
                            </button>
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
