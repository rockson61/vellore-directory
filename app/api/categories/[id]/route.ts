import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categoryHierarchy } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const categoryId = parseInt(id);

        // Get the category
        const category = await db
            .select()
            .from(categoryHierarchy)
            .where(eq(categoryHierarchy.id, categoryId))
            .limit(1);

        if (!category.length) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        // Get children
        const children = await db
            .select()
            .from(categoryHierarchy)
            .where(eq(categoryHierarchy.parentId, categoryId))
            .orderBy(categoryHierarchy.displayOrder);

        // Get breadcrumb path
        const breadcrumb = [];
        let currentCategory = category[0];

        while (currentCategory) {
            breadcrumb.unshift({
                id: currentCategory.id,
                name: currentCategory.name,
                slug: currentCategory.slug,
                level: currentCategory.level
            });

            if (currentCategory.parentId) {
                const parent = await db
                    .select()
                    .from(categoryHierarchy)
                    .where(eq(categoryHierarchy.id, currentCategory.parentId))
                    .limit(1);
                currentCategory = parent[0];
            } else {
                break;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                ...category[0],
                children,
                childCount: children.length,
                breadcrumb
            }
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}
