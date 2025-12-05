# Vellore Business Directory - Next.js

A modern, mobile-optimized local business directory for Vellore, Tamil Nadu, built with Next.js 14, Neon Postgres, and Neon Auth.

## Features

✨ **Claymorphic UI** - Soft, tactile design with pastel colors  
💧 **Liquid Glass Effects** - Frosted glass navigation  
🗄️ **Neon Postgres** - Serverless database  
🔐 **Neon Auth** - Built-in authentication  
🛒 **Shopping Cart** - Order via WhatsApp  
📱 **Mobile-First** - Optimized for mobile

## Tech Stack

- Next.js 14, Neon Postgres, Drizzle ORM
- Neon Auth (Stack Auth), Tailwind CSS, Framer Motion

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Neon Database

1. Go to [pg.new](https://pg.new) to create a Neon project
2. Enable **Neon Auth** in the Auth page
3. Copy environment variables to \`.env.local\`:

\`\`\`bash
# From Neon Console - Auth page
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# From Neon Console - Dashboard
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
\`\`\`

### 3. Set Up Authentication

\`\`\`bash
npx @stackframe/init-stack@latest --no-browser
\`\`\`

### 4. Push Database Schema

\`\`\`bash
npm run db:push
\`\`\`

### 5. Migrate Data

\`\`\`bash
npm run migrate
\`\`\`

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run db:push\` - Push schema to database
- \`npm run db:studio\` - Open database GUI
- \`npm run migrate\` - Import business data

## API Routes

- \`GET /api/businesses\` - List businesses (filter by category, search, pincode)
- \`GET /api/businesses/[id]\` - Get business details
- \`GET /api/categories\` - List categories
- \`POST /api/orders\` - Create order (requires auth)
- \`GET /api/orders\` - Get user orders (requires auth)

## Database Schema

**businesses**: id, name, category, address, phone, whatsapp_phone, location, rating, etc.  
**categories**: id, name, slug, count, icon, color  
**orders**: id, user_id, business_id, items, notes, customer_phone, status

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import to Vercel
3. Add Neon integration
4. Add environment variables
5. Deploy!

## Next Steps

- Add category and business detail pages
- Implement cart and WhatsApp flow
- Add user profiles and order history
- Implement search functionality

## License

MIT
