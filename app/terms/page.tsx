export const metadata = {
    title: 'Terms of Service - Vellore Directory',
    description: 'Read the terms and conditions for using Vellore Directory services.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <section className="gradient-hero py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Please read these terms carefully before using Vellore Directory
                    </p>
                    <p className="text-sm text-slate-500 mt-4">
                        Last Updated: December 3, 2024
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-card">
                    <div className="prose prose-slate max-w-none">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Vellore Directory ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                        </p>

                        <h2>2. Description of Service</h2>
                        <p>
                            Vellore Directory is a local business directory platform that provides information about businesses, services, and establishments in Vellore, Tamil Nadu. The Service includes:
                        </p>
                        <ul>
                            <li>Business listings and information</li>
                            <li>Search and discovery features</li>
                            <li>Business reviews and ratings</li>
                            <li>Contact information and directions</li>
                        </ul>

                        <h2>3. User Responsibilities</h2>
                        <h3>3.1 Acceptable Use</h3>
                        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                        <ul>
                            <li>Use the Service in any way that violates applicable laws or regulations</li>
                            <li>Submit false, misleading, or fraudulent information</li>
                            <li>Impersonate any person or entity</li>
                            <li>Engage in any automated data collection or scraping</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Upload viruses or malicious code</li>
                            <li>Harass, abuse, or harm other users</li>
                        </ul>

                        <h3>3.2 Business Listings</h3>
                        <p>If you submit a business listing, you represent and warrant that:</p>
                        <ul>
                            <li>You have the authority to represent the business</li>
                            <li>All information provided is accurate and current</li>
                            <li>You will promptly update any changes to business information</li>
                            <li>You own or have rights to any content you submit</li>
                        </ul>

                        <h2>4. Intellectual Property Rights</h2>
                        <h3>4.1 Our Content</h3>
                        <p>
                            The Service and its original content, features, and functionality are owned by Vellore Directory and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>

                        <h3>4.2 User Content</h3>
                        <p>
                            By submitting content to the Service (including business listings, reviews, and comments), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with the Service.
                        </p>

                        <h2>5. Disclaimer of Warranties</h2>
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
                        </p>
                        <ul>
                            <li>The Service will be uninterrupted or error-free</li>
                            <li>The information provided is accurate, complete, or current</li>
                            <li>Any defects will be corrected</li>
                            <li>The Service is free of viruses or harmful components</li>
                        </ul>

                        <h2>6. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, VELLORE DIRECTORY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                        </p>

                        <h2>7. Third-Party Content and Links</h2>
                        <p>
                            The Service may contain links to third-party websites or services that are not owned or controlled by Vellore Directory. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
                        </p>

                        <h2>8. Reviews and Ratings</h2>
                        <p>
                            Reviews and ratings displayed on the Service may come from various sources, including Google Places and user submissions. We do not verify the accuracy of reviews and ratings and are not responsible for their content.
                        </p>

                        <h2>9. Modifications to Service</h2>
                        <p>
                            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
                        </p>

                        <h2>10. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify users of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                        </p>

                        <h2>11. Termination</h2>
                        <p>
                            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>

                        <h2>12. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in Vellore, Tamil Nadu.
                        </p>

                        <h2>13. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:legal@vellore-directory.com" className="text-primary-600 hover:text-primary-700">legal@vellore-directory.com</a></li>
                            <li><strong>Phone:</strong> +91 70106 50063</li>
                            <li><strong>Address:</strong> Vellore, Tamil Nadu, India - 632001</li>
                        </ul>

                        <div className="mt-12 p-6 bg-primary-50 border border-primary-200 rounded-xl">
                            <p className="text-sm text-slate-700 mb-0">
                                <strong>Note:</strong> These terms of service are provided as a template. Please consult with a legal professional to ensure compliance with applicable laws and regulations in your jurisdiction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
