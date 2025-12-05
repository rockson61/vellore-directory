import { db } from '@/lib/db';
import { categoryHierarchy, businesses } from '@/lib/schema';
import { eq, asc, sql } from 'drizzle-orm';
import CategoryGrid from '@/components/CategoryGrid';
import CategoryBreadcrumb from '@/components/CategoryBreadcrumb';

export const metadata = {
    title: 'All Categories - Vellore Directory',
    description: 'Browse all business categories in Vellore',
};

async function getRootCategories() {
    const rootCats = await db
        .select()
        .from(categoryHierarchy)
        .where(eq(categoryHierarchy.level, 0))
        .orderBy(asc(categoryHierarchy.displayOrder), asc(categoryHierarchy.name));

    // Get counts for each category including subcategories
    const categoriesWithCounts = await Promise.all(
        rootCats.map(async (category) => {
            // Get all descendant category names
            const descendants = await db.execute(sql`
                WITH RECURSIVE category_tree AS (
                    SELECT id, name FROM category_hierarchy WHERE id = ${category.id}
                    UNION ALL
                    SELECT ch.id, ch.name 
                    FROM category_hierarchy ch
                    INNER JOIN category_tree ct ON ch.parent_id = ct.id
                )
                SELECT name FROM category_tree
            `);

            const categoryNames = (descendants.rows as Array<{ name: string }>).map(row => row.name);

            // Count businesses
            const count = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(businesses)
                .where(sql`${businesses.category} IN (${sql.join(categoryNames.map(name => sql`${name}`), sql`, `)})`);

            return {
                ...category,
                businessCount: count[0]?.count || 0
            };
        })
    );

    // Filter out categories with no businesses
    return categoriesWithCounts.filter(cat => cat.businessCount > 0);
}

export default async function CategoriesPage() {
    const categories = await getRootCategories();

    return (
        <div className="min-h-screen pb-12">
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <CategoryBreadcrumb items={[]} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Categories</h1>
                    <p className="text-slate-600">Find businesses and services in Vellore by category</p>
                </div>

                <CategoryGrid categories={categories} />
            </div>
        </div>
    );
}
