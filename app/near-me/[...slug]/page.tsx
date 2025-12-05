import { db } from '@/lib/db';
import { categoryHierarchy, businesses, locations, businessAmenities, businessHours, serviceOfferings } from '@/lib/schema';
import { eq, sql, desc, and } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EnhancedBusinessCard } from '@/components/business/EnhancedBusinessCard';
import CategoryGrid from '@/components/CategoryGrid';
import CategoryBreadcrumb from '@/components/CategoryBreadcrumb';
import BusinessDetailView from '@/components/business/BusinessDetailView';

interface Props {
    params: Promise<{ slug: string[] }>;
}

// Helper to resolve entities from slug array
async function resolveEntities(slugs: string[]) {
    let location = null;
    let category = null;
    let subcategory = null;
    let business = null;

    // 1. Check if the LAST slug is a business
    if (slugs.length > 0) {
        const lastSlug = slugs[slugs.length - 1];

        // First, check if it's a location (to prevent location slugs being treated as businesses)
        const isLocation = await db.query.locations.findFirst({
            where: eq(locations.slug, lastSlug),
        });

        // If the last slug is a location, this is an invalid URL structure
        // We should not have /location/category/another-location
        if (isLocation) {
            // Return null to trigger 404 or redirect
            return { location: null, category: null, subcategory: null, business: null };
        }

        // Now check if it's a business
        const b = await db.query.businesses.findFirst({
            where: eq(businesses.slug, lastSlug),
        });

        if (b) {
            business = b;
            return { location, category, subcategory, business };
        }
    }

    // 2. If not a business, try to resolve Location/Category hierarchy
    // Try to find location from the first slug
    if (slugs.length > 0) {
        const loc = await db.query.locations.findFirst({
            where: eq(locations.slug, slugs[0]),
        });
        if (loc) {
            location = loc;
            // If first is location, remaining could be category/subcategory
            if (slugs.length > 1) {
                const cat = await db.query.categoryHierarchy.findFirst({
                    where: eq(categoryHierarchy.slug, slugs[1]),
                });
                if (cat) {
                    category = cat;
                    if (slugs.length > 2) {
                        const sub = await db.query.categoryHierarchy.findFirst({
                            where: and(
                                eq(categoryHierarchy.slug, slugs[2]),
                                eq(categoryHierarchy.parentId, cat.id)
                            ),
                        });
                        if (sub) subcategory = sub;
                    }
                }
            }
        } else {
            // First slug is not a location, check if it's a category
            const cat = await db.query.categoryHierarchy.findFirst({
                where: eq(categoryHierarchy.slug, slugs[0]),
            });
            if (cat) {
                category = cat;
                if (slugs.length > 1) {
                    const sub = await db.query.categoryHierarchy.findFirst({
                        where: and(
                            eq(categoryHierarchy.slug, slugs[1]),
                            eq(categoryHierarchy.parentId, cat.id)
                        ),
                    });
                    if (sub) subcategory = sub;
                }
            }
        }
    }

    return { location, category, subcategory, business };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { location, category, subcategory, business } = await resolveEntities(slug);

    if (business) {
        return {
            title: `${business.name} - ${business.category} in Vellore`,
            description: business.description || `Visit ${business.name} in Vellore.`,
        };
    }

    const targetCategory = subcategory || category;

    if (location && targetCategory) {
        return {
            title: `${targetCategory.name} in ${location.name}, Vellore | Best ${targetCategory.name} Near Me`,
            description: `Find the best ${targetCategory.name.toLowerCase()} in ${location.name}, Vellore. Verified listings, reviews, contact numbers, and directions.`,
        };
    } else if (location) {
        return {
            title: `Businesses in ${location.name}, Vellore | Local Directory`,
            description: `Explore local businesses, shops, and services in ${location.name}, Vellore.`,
        };
    } else if (targetCategory) {
        return {
            title: `${targetCategory.name} Near Me in Vellore | Local Directory`,
            description: `Find top-rated ${targetCategory.name.toLowerCase()} in Vellore.`,
        };
    }

    return { title: 'Page Not Found' };
}

export default async function NearMePage({ params }: Props) {
    const { slug } = await params;
    const { location, category, subcategory, business } = await resolveEntities(slug);

    // Case 0: Business Detail
    if (business) {
        // Fetch additional business details
        const amenities = await db
            .select()
            .from(businessAmenities)
            .where(eq(businessAmenities.businessId, business.id.toString()));

        const hours = await db
            .select()
            .from(businessHours)
            .where(eq(businessHours.businessId, business.id.toString()));

        const services = await db
            .select()
            .from(serviceOfferings)
            .where(eq(serviceOfferings.businessId, business.id.toString()));

        // Construct breadcrumbs dynamically based on URL path
        // This is a simplified approach; ideally we'd resolve each segment to a name
        const breadcrumbs = slug.map((segment, index) => {
            const isLast = index === slug.length - 1;
            return {
                label: isLast ? business.name : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
                href: `/near-me/${slug.slice(0, index + 1).join('/')}`
            };
        });

        return (
            <BusinessDetailView
                business={business}
                amenities={amenities}
                hours={hours}
                services={services}
                breadcrumbs={breadcrumbs}
            />
        );
    }

    // Case 1: Location + Category (or Subcategory)
    if (location && (category || subcategory)) {
        return <LocationCategoryView location={location} category={subcategory || category!} parentCategory={subcategory ? category : null} />;
    }

    // Case 2: Location Only
    if (location) {
        return <LocationView location={location} />;
    }

    // Case 3: Category Only (or Subcategory)
    if (category) {
        return <CategoryView category={subcategory || category} parentCategory={subcategory ? category : null} />;
    }

    notFound();
}

// --- Components ---

async function LocationCategoryView({
    location,
    category,
    parentCategory
}: {
    location: typeof locations.$inferSelect,
    category: typeof categoryHierarchy.$inferSelect,
    parentCategory: typeof categoryHierarchy.$inferSelect | null
}) {
    // Fetch businesses in this location AND category
    const businessesData = await db
        .select()
        .from(businesses)
        .where(and(
            eq(businesses.pincode, location.pincode),
            eq(businesses.category, category.name)
        ))
        .limit(50);

    // Breadcrumbs
    const breadcrumbs = [
        { name: location.name, slug: location.slug, url: `/near-me/${location.slug}` },
        ...(parentCategory ? [{ name: parentCategory.name, slug: parentCategory.slug, url: `/near-me/${location.slug}/${parentCategory.slug}` }] : []),
        { name: category.name, slug: category.slug, url: `/near-me/${location.slug}/${parentCategory ? parentCategory.slug + '/' : ''}${category.slug}` }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
                        <span className="text-gray-400">/</span>
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-2">
                                {i < breadcrumbs.length - 1 ? (
                                    <Link href={crumb.url} className="text-gray-500 hover:text-primary">{crumb.name}</Link>
                                ) : (
                                    <span className="font-semibold text-primary">{crumb.name}</span>
                                )}
                                {i < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
                            </span>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {category.name} in {location.name}
                </h1>
                <p className="text-gray-600 mb-8">
                    Best {category.name.toLowerCase()} services in {location.name}, Vellore
                </p>

                {businessesData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businessesData.map((business) => (
                            <EnhancedBusinessCard key={business.id} business={business} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                        <p className="text-gray-500">
                            No {category.name.toLowerCase()} found in {location.name} yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

async function CategoryView({ category, parentCategory }: { category: typeof categoryHierarchy.$inferSelect, parentCategory: typeof categoryHierarchy.$inferSelect | null }) {
    // Get subcategories
    const subcategoriesData = await db
        .select()
        .from(categoryHierarchy)
        .where(eq(categoryHierarchy.parentId, category.id))
        .orderBy(categoryHierarchy.displayOrder, categoryHierarchy.name);

    const subcategoriesWithCounts = await Promise.all(subcategoriesData.map(async (sub) => {
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(businesses)
            .where(eq(businesses.category, sub.name));
        return { ...sub, count: Number(countResult[0].count) };
    }));

    // Filter out subcategories with no businesses
    const subcategories = subcategoriesWithCounts.filter(sub => sub.count > 0);

    // Get businesses
    const categoryBusinesses = await db
        .select()
        .from(businesses)
        .where(eq(businesses.category, category.name))
        .orderBy(desc(businesses.rating))
        .limit(50);

    // Breadcrumbs
    const breadcrumbs = [];
    if (parentCategory) {
        breadcrumbs.push({ id: parentCategory.id, name: parentCategory.name, slug: parentCategory.slug });
    }
    breadcrumbs.push({ id: category.id, name: category.name, slug: category.slug });

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <CategoryBreadcrumb items={breadcrumbs} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name} Near Me</h1>
                    {category.description && <p className="text-gray-600">{category.description}</p>}
                </div>

                {subcategories.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse {category.name}</h2>
                        <CategoryGrid categories={subcategories} />
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {categoryBusinesses.length > 0 ? `Top ${category.name} in Vellore` : `No ${category.name} found yet`}
                    </h2>
                    {categoryBusinesses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryBusinesses.map((business) => (
                                <EnhancedBusinessCard key={business.id} business={business} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                            <p className="text-gray-500">We couldn&apos;t find any businesses in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

async function LocationView({ location }: { location: typeof locations.$inferSelect }) {
    const locationBusinesses = await db
        .select()
        .from(businesses)
        .where(eq(businesses.pincode, location.pincode))
        .limit(100);

    if (locationBusinesses.length === 0) {
        const fuzzyBusinesses = await db
            .select()
            .from(businesses)
            .where(sql`lower(${businesses.address}) LIKE ${`%${location.name.toLowerCase()}%`}`)
            .limit(100);
        locationBusinesses.push(...fuzzyBusinesses);
    }

    const businessesByCategory: Record<string, typeof businesses.$inferSelect[]> = {};
    locationBusinesses.forEach(b => {
        const cat = b.category || 'Other';
        if (!businessesByCategory[cat]) businessesByCategory[cat] = [];
        businessesByCategory[cat].push(b);
    });

    const sortedCategories = Object.keys(businessesByCategory).sort();

    return (
        <div className="min-h-screen bg-gray-50">
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
                        <button className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors">Start Selling</button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <nav className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-red-500">Home</Link>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900">{location.name}</span>
                </nav>

                <section className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Businesses in {location.name}</h1>
                    <p className="text-gray-600">Explore local services and shops in {location.name}, Vellore ({location.pincode})</p>
                </section>

                {sortedCategories.length > 0 ? (
                    <div className="space-y-12">
                        {sortedCategories.map(category => (
                            <section key={category}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        {category}
                                        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{businessesByCategory[category].length}</span>
                                    </h2>
                                    <Link href={`/near-me/${location.slug}/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-red-500 hover:text-red-600 font-medium text-sm">View All</Link>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {businessesByCategory[category].slice(0, 6).map(business => (
                                        <EnhancedBusinessCard key={business.id} business={business} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <div className="text-4xl mb-4">🏪</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses found in {location.name} yet</h3>
                        <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">Add Your Business</button>
                    </div>
                )}
            </main>
        </div>
    );
}
