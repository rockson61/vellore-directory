import { db } from '@/lib/db';
import { businesses, businessAmenities, businessHours, serviceOfferings, locations, categoryHierarchy } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import BusinessDetailView from '@/components/business/BusinessDetailView';
import { generateLocalBusinessSchema, generateJsonLdScript } from '@/lib/seo/structured-data';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const business = await db.query.businesses.findFirst({
        where: eq(businesses.slug, slug),
    });

    if (!business) return { title: 'Business Not Found' };

    return {
        title: `${business.name} - ${business.category} in Vellore`,
        description: business.description || `Visit ${business.name} in Vellore.`,
    };
}

export default async function BusinessPage({ params }: Props) {
    const { slug } = await params;

    // Get business
    const business = await db.query.businesses.findFirst({
        where: eq(businesses.slug, slug),
    });

    if (!business) {
        notFound();
    }

    // Attempt to resolve canonical URL for redirect
    const location = await db.query.locations.findFirst({
        where: eq(locations.pincode, business.pincode || ''),
    });

    const category = await db.query.categoryHierarchy.findFirst({
        where: eq(categoryHierarchy.name, business.category || ''),
    });

    if (location && category) {
        permanentRedirect(`/near-me/${location.slug}/${category.slug}/${business.slug}`);
    }

    // Fallback: Render the page if we can't construct the canonical URL
    const b = business;

    // Get amenities
    const amenities = await db
        .select()
        .from(businessAmenities)
        .where(eq(businessAmenities.businessId, b.id.toString()));

    // Get business hours
    const hours = await db
        .select()
        .from(businessHours)
        .where(eq(businessHours.businessId, b.id.toString()));

    // Get services (if professional service)
    const services = await db
        .select()
        .from(serviceOfferings)
        .where(eq(serviceOfferings.businessId, b.id.toString()));

    const breadcrumbs = [
        { label: b.category || 'Business', href: `/near-me/${b.category?.toLowerCase().replace(/\s+/g, '-')}` },
        { label: b.name, href: `/business/${b.slug}` }
    ];

    // Generate JSON-LD structured data
    const jsonLd = generateLocalBusinessSchema(b, location || undefined);

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={generateJsonLdScript(jsonLd)}
            />

            <BusinessDetailView
                business={b}
                amenities={amenities}
                hours={hours}
                services={services}
                breadcrumbs={breadcrumbs}
            />
        </>
    );
}
