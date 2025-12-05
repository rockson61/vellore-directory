'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { QuickContact } from '@/components/marketing/QuickContact';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just show success message
        // In production, this would send to an API endpoint
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <section className="gradient-hero py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Contact Us
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Have questions or suggestions? We&apos;d love to hear from you. Get in touch with us today!
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Get in Touch</h2>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                                    <a href="mailto:info@vellore-directory.com" className="text-primary-600 hover:text-primary-700">
                                        info@vellore-directory.com
                                    </a>
                                    <p className="text-sm text-slate-500 mt-1">We&apos;ll respond within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                                    <a href="tel:+917010650063" className="text-primary-600 hover:text-primary-700">
                                        +91 70106 50063
                                    </a>
                                    <p className="text-sm text-slate-500 mt-1">Mon-Sat, 9:00 AM - 6:00 PM IST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Location</h3>
                                    <p className="text-slate-600">
                                        Vellore, Tamil Nadu<br />
                                        India - 632001
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white rounded-2xl p-6 shadow-card">
                            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <a href="/about" className="block text-primary-600 hover:text-primary-700">
                                    → About Vellore Directory
                                </a>
                                <a href="/sitemap-html" className="block text-primary-600 hover:text-primary-700">
                                    → Browse All Categories
                                </a>
                                <a href="/privacy" className="block text-primary-600 hover:text-primary-700">
                                    → Privacy Policy
                                </a>
                                <a href="/terms" className="block text-primary-600 hover:text-primary-700">
                                    → Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <div className="bg-white rounded-3xl p-8 shadow-card">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>

                            {submitted && (
                                <div className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-xl text-accent-800">
                                    ✓ Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="business">List My Business</option>
                                        <option value="support">Technical Support</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Contact Widget */}
            <QuickContact />
        </div>
    );
}
