import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import PhotoGallery from '@/components/business/PhotoGallery';
import OpeningHours from '@/components/business/OpeningHours';
import GoogleMapEmbed from '@/components/business/GoogleMapEmbed';
import ContactCard from '@/components/business/ContactCard';
import ShareButtons from '@/components/business/ShareButtons';
import FAQSection from '@/components/business/FAQSection';
import KeywordsSection from '@/components/business/KeywordsSection';

interface BusinessDetailViewProps {
    business: any;
    amenities: any[];
    hours: any[];
    services: any[];
    breadcrumbs: { label: string; href: string }[];
}

export default function BusinessDetailView({ business: b, amenities, hours, services, breadcrumbs }: BusinessDetailViewProps) {
    const images = b.images as string[] | null;

    // Generate Schema
    const businessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: b.name,
        image: images || [],
        address: {
            '@type': 'PostalAddress',
            streetAddress: b.address,
            addressLocality: 'Vellore',
            addressRegion: 'TN',
            postalCode: b.pincode,
            addressCountry: 'IN'
        },
        telephone: b.phone,
        url: `https://top.vellore24.com/business/${b.slug}`,
        priceRange: '₹₹'
    };

    // Check Open Status from opening_hours JSON
    const openingHours = b.openingHours as any;
    const isOpen = openingHours?.open_now || false;
    const statusText = isOpen ? 'Open Now' : 'Closed';

    const currentUrl = `https://top.vellore24.com/business/${b.slug}`;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SchemaMarkup schema={businessSchema} />

            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl">📍</span>
                            <div>
                                <h1 className="text-lg font-extrabold leading-none">
                                    <span className="text-gray-800">Vellore</span>
                                    <span className="text-red-500">Directory</span>
                                </h1>
                            </div>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/search" className="p-2 text-gray-500 hover:text-primary">
                                <Search className="w-5 h-5" />
                            </Link>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors">
                                Start Selling
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4" />
                            {index === breadcrumbs.length - 1 ? (
                                <span className="text-gray-900 font-medium">{crumb.label}</span>
                            ) : (
                                <Link href={crumb.href} className="hover:text-primary">
                                    {crumb.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Hero Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{b.name}</h1>
                            <div className="flex items-center gap-3 mb-2">
                                {b.rating && (
                                    <>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                            ⭐ {b.rating} ({b.totalRatings || 0} reviews)
                                        </span>
                                        <span className="text-gray-300">•</span>
                                    </>
                                )}
                                {b.category && <span className="text-gray-600">{b.category}</span>}
                                {isOpen && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-green-600 font-medium">{statusText}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Photo Gallery */}
                        {images && images.length > 0 && (
                            <PhotoGallery photos={images} businessName={b.name} />
                        )}

                        {/* About Section */}
                        {b.description && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                                <div className="prose prose-slate max-w-none">
                                    <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {b.description.split('\n').map((paragraph: string, index: number) => {
                                            // Handle headings
                                            if (paragraph.startsWith('## ')) {
                                                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                                            }
                                            if (paragraph.startsWith('### ')) {
                                                return <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                                            }
                                            // Handle bold text
                                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                                return <p key={index} className="font-bold text-gray-900 mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</p>;
                                            }
                                            // Handle list items
                                            if (paragraph.startsWith('- ')) {
                                                return <li key={index} className="ml-6 mb-2">{paragraph.replace('- ', '')}</li>;
                                            }
                                            // Regular paragraphs
                                            if (paragraph.trim()) {
                                                return <p key={index} className="mb-4">{paragraph}</p>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services */}
                        {services.length > 0 && (
                            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span>🛠️</span> Services Offered
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {services.map(service => (
                                        <div key={service.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary/20 hover:bg-blue-50/30 transition-all">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                {service.serviceName}
                                            </div>
                                            {service.serviceDescription && (
                                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                                    {service.serviceDescription}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-sm mt-2">
                                                <span className="text-gray-400 flex items-center gap-1">
                                                    ⏱️ {service.durationMinutes}m
                                                </span>
                                                {service.price && (
                                                    <span className="font-bold text-gray-900">₹{service.price}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FAQ Section */}
                        <FAQSection
                            businessName={b.name}
                            category={b.category}
                            location={b.location}
                        />

                        {/* Keywords Section */}
                        <KeywordsSection
                            businessName={b.name}
                            category={b.category}
                            location={b.location}
                            types={b.types}
                        />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <ContactCard business={{
                            name: b.name,
                            phone: b.phone,
                            email: b.email,
                            website: b.website,
                            whatsappPhone: b.whatsapp_phone || b.whatsappPhone,
                            address: b.address
                        }} />

                        {/* Opening Hours */}
                        {openingHours && (
                            <OpeningHours openingHours={openingHours} />
                        )}

                        {/* Google Map */}
                        {b.latitude && b.longitude && (
                            <GoogleMapEmbed
                                latitude={parseFloat(b.latitude)}
                                longitude={parseFloat(b.longitude)}
                                businessName={b.name}
                            />
                        )}

                        {/* Share Buttons */}
                        <ShareButtons
                            businessName={b.name}
                            url={currentUrl}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
