import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { CategoryCard } from '@/components/ui/CategoryCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let allCategories: Array<{
    id: number;
    name: string;
    slug: string;
    count: number | null;
    icon: string | null;
    color: string | null;
  }> = [];

  try {
    allCategories = await db.select().from(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="glass-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <h1 className="text-xl font-extrabold">
                <span className="text-text-primary">Vellore</span>
                <span className="text-primary">Directory</span>
              </h1>
            </Link>
            <button className="btn-primary text-sm py-2 px-4">
              Start Selling
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-text-primary mb-2">
            Find shops near you
          </h2>
          <p className="text-text-secondary mb-4">Order on WhatsApp</p>
          <Link href="/categories" className="btn-primary inline-block">
            Browse All Categories
          </Link>
        </section>

        {/* Categories Grid */}
        <section>
          {allCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">📦</div>
              <h3 className="text-xl font-bold mb-2">No categories yet</h3>
              <p className="text-text-secondary mb-6">
                Set up your Neon database and run the migration script
              </p>
              <div className="bg-white rounded-clay-lg p-6 max-w-2xl mx-auto text-left shadow-clay-md">
                <h4 className="font-bold mb-2">Quick Setup:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                  <li>Create a Neon project at <a href="https://pg.new" target="_blank" className="text-primary hover:underline">pg.new</a></li>
                  <li>Copy your DATABASE_URL to .env.local</li>
                  <li>Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:push</code></li>
                  <li>Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run migrate</code></li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allCategories.map(cat => (
                <CategoryCard key={cat.id} {...cat} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
