export const metadata = {
    title: 'Privacy Policy - Vellore Directory',
    description: 'Learn how Vellore Directory collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <section className="gradient-hero py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Your privacy is important to us. Learn how we collect, use, and protect your information.
                    </p>
                    <p className="text-sm text-slate-500 mt-4">
                        Last Updated: December 3, 2024
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-card">
                    <div className="prose prose-slate max-w-none">
                        <h2>1. Information We Collect</h2>
                        <p>
                            Vellore Directory collects information to provide better services to our users. We collect information in the following ways:
                        </p>

                        <h3>1.1 Information You Provide</h3>
                        <ul>
                            <li><strong>Contact Information:</strong> When you contact us through our contact form, we collect your name, email address, phone number, and message content.</li>
                            <li><strong>Business Listings:</strong> If you submit a business listing, we collect business name, address, contact details, and other relevant information.</li>
                        </ul>

                        <h3>1.2 Information We Collect Automatically</h3>
                        <ul>
                            <li><strong>Usage Data:</strong> We collect information about how you interact with our website, including pages visited, search queries, and time spent on pages.</li>
                            <li><strong>Device Information:</strong> We may collect information about your device, including IP address, browser type, and operating system.</li>
                            <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience and analyze website traffic.</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect for the following purposes:</p>
                        <ul>
                            <li>To provide and maintain our directory services</li>
                            <li>To respond to your inquiries and provide customer support</li>
                            <li>To improve and optimize our website and services</li>
                            <li>To send you updates and notifications (with your consent)</li>
                            <li>To detect and prevent fraud and abuse</li>
                            <li>To comply with legal obligations</li>
                        </ul>

                        <h2>3. Information Sharing and Disclosure</h2>
                        <p>
                            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                        </p>
                        <ul>
                            <li><strong>With Your Consent:</strong> We will share information when you explicitly authorize us to do so.</li>
                            <li><strong>Business Listings:</strong> Information you provide for business listings will be publicly displayed on our directory.</li>
                            <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
                        </ul>

                        <h2>4. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>

                        <h2>5. Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies and similar tracking technologies to:
                        </p>
                        <ul>
                            <li>Remember your preferences and settings</li>
                            <li>Understand how you use our website</li>
                            <li>Improve our services and user experience</li>
                            <li>Provide personalized content and recommendations</li>
                        </ul>
                        <p>
                            You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
                        </p>

                        <h2>6. Your Rights and Choices</h2>
                        <p>You have the following rights regarding your personal information:</p>
                        <ul>
                            <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
                            <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information.</li>
                            <li><strong>Deletion:</strong> You can request deletion of your personal information, subject to legal obligations.</li>
                            <li><strong>Opt-Out:</strong> You can opt-out of receiving promotional communications from us.</li>
                        </ul>

                        <h2>7. Children's Privacy</h2>
                        <p>
                            Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                        </p>

                        <h2>8. Third-Party Links</h2>
                        <p>
                            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before providing any information.
                        </p>

                        <h2>9. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                        </p>

                        <h2>10. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:privacy@vellore-directory.com" className="text-primary-600 hover:text-primary-700">privacy@vellore-directory.com</a></li>
                            <li><strong>Phone:</strong> +91 70106 50063</li>
                            <li><strong>Address:</strong> Vellore, Tamil Nadu, India - 632001</li>
                        </ul>

                        <div className="mt-12 p-6 bg-primary-50 border border-primary-200 rounded-xl">
                            <p className="text-sm text-slate-700 mb-0">
                                <strong>Note:</strong> This privacy policy is provided as a template. Please consult with a legal professional to ensure compliance with applicable privacy laws and regulations in your jurisdiction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
