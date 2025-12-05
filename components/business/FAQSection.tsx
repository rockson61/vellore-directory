'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    businessName: string;
    category: string | null;
    location: any;
}

export default function FAQSection({ businessName, category, location }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Generate FAQs based on business info
    const faqs: FAQ[] = [
        {
            question: `What are the opening hours of ${businessName}?`,
            answer: `Please check the opening hours section above for the current schedule of ${businessName}.`,
        },
        {
            question: `How can I contact ${businessName}?`,
            answer: `You can contact ${businessName} using the phone number, email, or website listed in the contact information section above.`,
        },
    ];

    if (category) {
        faqs.push({
            question: `What services does ${businessName} offer?`,
            answer: `${businessName} is a ${category} business. Please contact them directly for detailed information about their services.`,
        });
    }

    if (typeof location === 'string') {
        faqs.push({
            question: `Where is ${businessName} located?`,
            answer: `${businessName} is located in ${location}, Vellore. You can find the exact address and map in the location section above.`,
        });
    }

    faqs.push({
        question: `How do I get directions to ${businessName}?`,
        answer: `Click the \"Get Directions\" button above to open Google Maps with directions to ${businessName}.`,
    });

    return (
        <div className="clay-card p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="icon-container bg-accent-100 text-accent-700">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-clay-sm">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors focus-ring"
                            aria-expanded={openIndex === index}
                        >
                            <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="px-4 pb-4 text-slate-600 animate-slide-down">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* JSON-LD Schema for FAQ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map(faq => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer,
                            },
                        })),
                    }),
                }}
            />
        </div>
    );
}
