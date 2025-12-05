import Link from 'next/link';
import { MapPin, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const currentYear = new Date().getFullYear();

const footerLinks = {
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
    categories: [
        { name: 'Restaurants', href: '/near-me/food-and-dining' },
        { name: 'Hospitals', href: '/near-me/health-and-medical' },
        { name: 'Shopping', href: '/near-me/shopping-and-retail' },
        { name: 'Services', href: '/near-me/services' },
    ],
    resources: [
        { name: 'Browse Categories', href: '/categories' },
        { name: 'Near Me', href: '/near-me' },
        { name: 'Search', href: '/search' },
    ],
};

const nearbyLocations = [
    'Katpadi', 'Bagayam', 'Gandhi Nagar', 'Sathuvachari', 'Thottapalayam'
];

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold leading-none">
                                    <span className="text-white">Vellore</span>
                                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Directory</span>
                                </h3>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Your comprehensive guide to local businesses in Vellore, Tamil Nadu.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                                <div>
                                    <div className="font-medium text-white">Location</div>
                                    <div className="text-slate-400">Vellore, Tamil Nadu, India</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-primary-400 mt-0.5" />
                                <div>
                                    <div className="font-medium text-white">Email</div>
                                    <a href="mailto:info@vellore-directory.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                                        info@vellore-directory.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Categories */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Popular Categories</h4>
                        <ul className="space-y-2">
                            {footerLinks.categories.map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Nearby Locations */}
                <div className="border-t border-slate-800 pt-8 mb-8">
                    <h4 className="font-bold text-white mb-4">Nearby Locations</h4>
                    <div className="flex flex-wrap gap-2">
                        {nearbyLocations.map(location => (
                            <Link
                                key={location}
                                href={`/near-me/${location.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-xs bg-slate-800 px-3 py-1.5 rounded-full text-slate-300 hover:bg-primary-500 hover:text-white transition-colors"
                            >
                                {location}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Social Media */}
                <div className="border-t border-slate-800 pt-8 mb-8">
                    <h4 className="font-bold text-white mb-4">Follow Us</h4>
                    <div className="flex gap-3">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors group"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors group"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors group"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors group"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-800 pt-6 text-center">
                    <p className="text-sm text-slate-400">
                        © {currentYear} Vellore Directory. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                        Made with ❤️ for Vellore, Tamil Nadu
                    </p>
                </div>
            </div>
        </footer>
    );
}
