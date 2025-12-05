import { pgTable, serial, text, integer, boolean, timestamp, decimal, time, date, jsonb } from 'drizzle-orm/pg-core';

// ===== EXISTING TABLES =====

export const businesses = pgTable('businesses', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique(), // New slug column
    description: text('description'),
    address: text('address'),
    pincode: text('pincode'),
    phone: text('phone'),
    email: text('email'),
    website: text('website'),
    category: text('category'),
    rating: text('rating'),
    totalRatings: integer('total_ratings').default(0),
    latitude: text('latitude'),
    longitude: text('longitude'),
    status: text('status').default('active'), // active, closed, pending
    verified: boolean('verified').default(false),
    amenities: jsonb('amenities').$type<string[]>(), // e.g., ["WiFi", "Parking"]
    openingHours: jsonb('opening_hours').$type<{
        weekday_text?: string[];
        open_now?: boolean;
        periods?: any[];
    }>(), // Google Places opening hours format
    images: jsonb('images').$type<string[]>(),
    whatsappPhone: text('whatsapp_phone'), // Legacy column
    location: jsonb('location'), // Legacy column
    types: jsonb('types'), // Legacy column
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export type Business = typeof businesses.$inferSelect;

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    count: integer('count').default(0),
    icon: text('icon'),
    color: text('color'),
});

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    userId: text('user_id'),
    businessId: text('business_id').references(() => businesses.id),
    items: jsonb('items'),
    notes: text('notes'),
    customerPhone: text('customer_phone'),
    status: text('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
});

// ===== NEW TABLES FOR GMB CATEGORIES =====

export const categoryHierarchy = pgTable('category_hierarchy', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    parentId: integer('parent_id'),
    level: integer('level').notNull(), // 0=root, 1=main, 2=sub, 3=specialty
    icon: text('icon'),
    color: text('color'),
    description: text('description'),
    isProfessionalService: boolean('is_professional_service').default(false),
    allowsBooking: boolean('allows_booking').default(false),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

export const businessTags = pgTable('business_tags', {
    id: serial('id').primaryKey(),
    businessId: text('business_id').references(() => businesses.id),
    tag: text('tag').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const businessAmenities = pgTable('business_amenities', {
    id: serial('id').primaryKey(),
    businessId: text('business_id').references(() => businesses.id),
    amenityType: text('amenity_type').notNull(), // 'accessibility', 'payment', 'service', 'atmosphere'
    amenityName: text('amenity_name').notNull(),
    amenityValue: text('amenity_value'), // e.g., 'yes', 'no', 'limited'
    createdAt: timestamp('created_at').defaultNow(),
});

export const businessHours = pgTable('business_hours', {
    id: serial('id').primaryKey(),
    businessId: text('business_id').references(() => businesses.id),
    dayOfWeek: integer('day_of_week').notNull(), // 0=Sunday, 6=Saturday
    openTime: time('open_time'),
    closeTime: time('close_time'),
    isClosed: boolean('is_closed').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

export const serviceOfferings = pgTable('service_offerings', {
    id: serial('id').primaryKey(),
    businessId: text('business_id').references(() => businesses.id),
    serviceName: text('service_name').notNull(),
    serviceDescription: text('service_description'),
    durationMinutes: integer('duration_minutes').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }),
    isBookable: boolean('is_bookable').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

export const appointments = pgTable('appointments', {
    id: serial('id').primaryKey(),
    businessId: text('business_id').references(() => businesses.id),
    serviceId: integer('service_id').references(() => serviceOfferings.id),
    userId: text('user_id'),
    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone').notNull(),
    customerEmail: text('customer_email'),
    appointmentDate: date('appointment_date').notNull(),
    appointmentTime: time('appointment_time').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    status: text('status').default('pending'), // pending, confirmed, cancelled, completed
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const locations = pgTable('locations', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    pincode: text('pincode').notNull(),
    city: text('city').default('Vellore'),
    state: text('state').default('Tamil Nadu'),
    description: text('description'),
    latitude: decimal('latitude', { precision: 10, scale: 6 }),
    longitude: decimal('longitude', { precision: 10, scale: 6 }),
    createdAt: timestamp('created_at').defaultNow(),
});
