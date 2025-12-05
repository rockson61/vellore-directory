import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categoryHierarchy } from '@/lib/schema';
import { eq, isNull } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get('parent_id');
        const level = searchParams.get('level');
        const includeChildren = searchParams.get('include_children') === 'true';

        let query;

        if (parentId) {
            // Get children of specific parent
            query = db
                .select()
                .from(categoryHierarchy)
                .where(eq(categoryHierarchy.parentId, parseInt(parentId)))
                .orderBy(categoryHierarchy.displayOrder);
        } else if (level) {
            // Get all categories at specific level
            query = db
                .select()
                .from(categoryHierarchy)
                .where(eq(categoryHierarchy.level, parseInt(level)))
                .orderBy(categoryHierarchy.displayOrder);
        } else {
            // Get root categories (level 0)
            query = db
                .select()
                .from(categoryHierarchy)
                .where(isNull(categoryHierarchy.parentId))
                .orderBy(categoryHierarchy.displayOrder);
        }

        const results = await query;

        // If include_children is true, fetch children for each category
        if (includeChildren && results.length > 0) {
            const categoriesWithChildren = await Promise.all(
                results.map(async (category) => {
                    const children = await db
                        .select()
                        .from(categoryHierarchy)
                        .where(eq(categoryHierarchy.parentId, category.id))
                        .orderBy(categoryHierarchy.displayOrder);

                    return {
                        ...category,
                        children,
                        childCount: children.length
                    };
                })
            );

            return NextResponse.json({
                success: true,
                data: categoriesWithChildren
            });
        }

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
