import Link from 'next/link';
import { MapPin, Target, Heart, Award, TrendingUp } from 'lucide-react';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { QuickContact } from '@/components/marketing/QuickContact';

export const metadata = {
    title: 'About Us - Vellore Directory',
    description: 'Learn about Vellore Directory, your trusted local business directory connecting people with the best businesses in Vellore, Tamil Nadu.',
    openGraph: {
        title: 'About Vellore Directory',
        description: 'Your trusted local business directory for Vellore, Tamil Nadu',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <section className="gradient-hero py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        About Vellore Directory
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Your trusted local business directory connecting people with the best businesses in Vellore, Tamil Nadu
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Mission & Vision */}
                <section className="mb-16">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl p-8 shadow-card">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                            <p className="text-slate-600 leading-relaxed">
                                To empower local businesses in Vellore by providing a comprehensive, easy-to-use platform that connects them with customers. We strive to make discovering and accessing local services simple, reliable, and efficient for everyone in our community.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-card">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
                            <p className="text-slate-600 leading-relaxed">
                                To become the most trusted and comprehensive business directory in Vellore, fostering economic growth and community connections. We envision a future where every local business has the opportunity to thrive and every resident can easily find the services they need.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How Vellore Directory Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-bold text-primary-600">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Search & Discover</h3>
                            <p className="text-slate-600">
                                Browse through our extensive database of local businesses by category, location, or search for specific services you need.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-bold text-secondary-600">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">View Details & Reviews</h3>
                            <p className="text-slate-600">
                                Access comprehensive business information including addresses, ratings, reviews, and operating hours to make informed decisions.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-bold text-accent-600">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Connect & Engage</h3>
                            <p className="text-slate-600">
                                Contact businesses directly via phone, WhatsApp, or visit their location using integrated maps and directions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="mb-16">
                    <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-3xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-8 text-center">Vellore Directory by Numbers</h2>
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-5xl font-bold mb-2">3,799+</div>
                                <div className="text-primary-100">Local Businesses</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">495+</div>
                                <div className="text-primary-100">Categories</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">35+</div>
                                <div className="text-primary-100">Locations</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">4.49</div>
                                <div className="text-primary-100">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Choose Vellore Directory?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-card">
                            <MapPin className="w-12 h-12 text-primary-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Comprehensive Coverage</h3>
                            <p className="text-slate-600">
                                Access information on thousands of businesses across Vellore, from restaurants to healthcare, all in one place.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-card">
                            <Award className="w-12 h-12 text-primary-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Information</h3>
                            <p className="text-slate-600">
                                All business listings include verified contact details, addresses, and authentic customer reviews.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-card">
                            <TrendingUp className="w-12 h-12 text-primary-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Always Updated</h3>
                            <p className="text-slate-600">
                                Our directory is regularly updated with new businesses and the latest information to serve you better.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-card">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Explore?</h2>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Start discovering the best local businesses in Vellore today. Whether you&apos;re looking for restaurants, services, or shops, we&apos;ve got you covered.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/categories" className="btn-primary">
                                Browse Categories
                            </Link>
                            <Link href="/near-me" className="btn-outline">
                                Search Near Me
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section>
                    <NewsletterSignup />
                </section>
            </div>

            {/* Quick Contact Widget */}
            <QuickContact />
        </div>
    );
}
