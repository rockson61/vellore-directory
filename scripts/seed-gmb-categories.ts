import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

// GMB Categories organized hierarchically
const categoryHierarchy = {
    'Food & Dining': {
        icon: '🍽️',
        color: '#FFE5E5',
        subcategories: {
            'Restaurants': [
                'Restaurant', 'American restaurant', 'Chinese restaurant', 'Italian restaurant',
                'Mexican restaurant', 'Indian restaurant', 'Japanese restaurant', 'Thai restaurant',
                'French restaurant', 'Mediterranean restaurant', 'Greek restaurant', 'Spanish restaurant',
                'Korean restaurant', 'Vietnamese restaurant', 'Lebanese restaurant', 'Turkish restaurant',
                'Brazilian restaurant', 'Argentinian restaurant', 'Peruvian restaurant', 'Cuban restaurant',
                'Ethiopian restaurant', 'Moroccan restaurant', 'Pakistani restaurant', 'Bangladeshi restaurant',
                'Sri Lankan restaurant', 'Nepalese restaurant', 'Afghan restaurant', 'Iranian restaurant',
                'Filipino restaurant', 'Indonesian restaurant', 'Malaysian restaurant', 'Singaporean restaurant',
                'Burmese restaurant', 'Cambodian restaurant', 'Laotian restaurant', 'Mongolian restaurant',
                'Tibetan restaurant', 'Russian restaurant', 'Polish restaurant', 'German restaurant',
                'Austrian restaurant', 'Swiss restaurant', 'Belgian restaurant', 'Dutch restaurant',
                'Scandinavian restaurant', 'Irish restaurant', 'British restaurant', 'Scottish restaurant',
                'Portuguese restaurant', 'Moroccan restaurant', 'Egyptian restaurant', 'South African restaurant',
                'Caribbean restaurant', 'Jamaican restaurant', 'Hawaiian restaurant', 'Polynesian restaurant',
                'Fusion restaurant', 'Asian fusion restaurant', 'Pan-Asian restaurant', 'Modern European restaurant',
                'Contemporary American restaurant', 'New American restaurant', 'Californian restaurant',
                'Tex-Mex restaurant', 'Cajun restaurant', 'Creole restaurant', 'Southern restaurant (US)',
                'Barbecue restaurant', 'Steakhouse', 'Seafood restaurant', 'Sushi restaurant',
                'Ramen restaurant', 'Udon noodle restaurant', 'Soba noodle shop', 'Tempura restaurant',
                'Yakitori restaurant', 'Izakaya restaurant', 'Teppanyaki restaurant', 'Shabu-shabu restaurant',
                'Dim sum restaurant', 'Cantonese restaurant', 'Sichuan restaurant', 'Hunan restaurant',
                'Peking duck restaurant', 'Hot pot restaurant', 'Noodle shop', 'Dumpling restaurant',
                'Biryani restaurant', 'Tandoori restaurant', 'Curry restaurant', 'Dosa restaurant',
                'Thali restaurant', 'Street food restaurant', 'Tapas restaurant', 'Mezze restaurant',
                'Kebab shop', 'Shawarma restaurant', 'Falafel restaurant', 'Pita restaurant',
                'Pizza restaurant', 'Pasta restaurant', 'Trattoria', 'Osteria', 'Pizzeria',
                'Taco restaurant', 'Burrito restaurant', 'Quesadilla restaurant', 'Enchilada restaurant',
                'Pho restaurant', 'Banh mi restaurant', 'Pad Thai restaurant', 'Curry house',
                'Buffet restaurant', 'All-you-can-eat restaurant', 'Family restaurant', 'Fine dining restaurant',
                'Casual dining restaurant', 'Fast casual restaurant', 'Diner', 'Bistro', 'Brasserie',
                'Gastropub', 'Pub', 'Bar & grill', 'Sports bar', 'Wine bar', 'Cocktail bar'
            ],
            'Fast Food & Quick Service': [
                'Fast food restaurant', 'Burger restaurant', 'Hamburger restaurant', 'Chicken restaurant',
                'Fried chicken takeaway', 'Chicken wings restaurant', 'Sandwich shop', 'Sub sandwich shop',
                'Deli', 'Hot dog stand', 'Hot dog restaurant', 'Fish & chips restaurant', 'Fish and chips takeaway',
                'Donut shop', 'Bagel shop', 'Pretzel store', 'Popcorn store', 'Ice cream shop',
                'Frozen yogurt shop', 'Smoothie shop', 'Juice shop', 'Bubble tea store', 'Milk tea shop',
                'Snack bar', 'Food court', 'Food stand', 'Street vendor', 'Food truck'
            ],
            'Cafes & Coffee Shops': [
                'Cafe', 'Coffee shop', 'Espresso bar', 'Coffee stand', 'Tea house', 'Tea room',
                'Bakery cafe', 'Patisserie', 'Internet cafe', 'Cat cafe', 'Dog cafe', 'Board game cafe',
                'Book cafe', 'Art cafe', 'Music cafe', 'Hookah bar', 'Shisha lounge'
            ],
            'Bakeries & Desserts': [
                'Bakery', 'Pastry shop', 'Cake shop', 'Cupcake shop', 'Cookie shop', 'Pie shop',
                'Chocolate shop', 'Candy store', 'Confectionery', 'Dessert shop', 'Dessert restaurant',
                'Gelato shop', 'Sorbet shop', 'Crepe shop', 'Waffle house', 'Pancake restaurant'
            ],
            'Bars & Nightlife': [
                'Bar', 'Pub', 'Cocktail bar', 'Wine bar', 'Beer garden', 'Beer hall', 'Brewery',
                'Brewpub', 'Distillery', 'Tiki bar', 'Sports bar', 'Dive bar', 'Lounge', 'Night club',
                'Dance club', 'Jazz club', 'Blues club', 'Live music venue', 'Karaoke bar'
            ]
        }
    },
    'Health & Medical': {
        icon: '🏥',
        color: '#E0F4E8',
        isProfessional: true,
        allowsBooking: true,
        subcategories: {
            'Hospitals & Clinics': [
                'Hospital', 'General hospital', 'Specialized hospital', 'Children\'s hospital', 'Women\'s hospital',
                'Maternity hospital', 'Psychiatric hospital', 'Rehabilitation center', 'Medical clinic',
                'Walk-in clinic', 'Urgent care center', 'Emergency room', 'Trauma center'
            ],
            'Doctors & Specialists': [
                'Doctor', 'General practitioner', 'Family physician', 'Internist', 'Pediatrician',
                'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic surgeon', 'Ophthalmologist',
                'ENT specialist', 'Gastroenterologist', 'Urologist', 'Gynecologist', 'Obstetrician',
                'Endocrinologist', 'Rheumatologist', 'Oncologist', 'Hematologist', 'Nephrologist',
                'Pulmonologist', 'Allergist', 'Immunologist', 'Infectious disease physician',
                'Geriatrician', 'Psychiatrist', 'Psychologist', 'Therapist', 'Counselor'
            ],
            'Dental Care': [
                'Dentist', 'Dental clinic', 'Orthodontist', 'Periodontist', 'Endodontist',
                'Oral surgeon', 'Cosmetic dentist', 'Pediatric dentist', 'Dental hygienist',
                'Dental implants provider', 'Teeth whitening service', 'Emergency dental service'
            ],
            'Eye Care': [
                'Optometrist', 'Ophthalmologist', 'Eye care center', 'Optical store', 'Contact lenses supplier',
                'Lasik surgeon', 'Eye clinic', 'Vision center'
            ],
            'Alternative Medicine': [
                'Acupuncturist', 'Acupuncture clinic', 'Chiropractor', 'Homeopath', 'Naturopath',
                'Ayurvedic clinic', 'Chinese medicine clinic', 'Herbalist', 'Massage therapist',
                'Reflexologist', 'Reiki therapist', 'Aromatherapy service'
            ],
            'Pharmacies & Medical Supply': [
                'Pharmacy', 'Drugstore', 'Medical supply store', 'Surgical supply store',
                'Diabetes equipment supplier', 'Wheelchair store', 'Hearing aid store'
            ]
        }
    },
    'Shopping & Retail': {
        icon: '🛍️',
        color: '#E0EFFF',
        subcategories: {
            'Clothing & Fashion': [
                'Clothing store', 'Fashion boutique', 'Men\'s clothing store', 'Women\'s clothing store',
                'Children\'s clothing store', 'Baby clothing store', 'Plus size clothing store',
                'Vintage clothing store', 'Sportswear store', 'Athletic wear store', 'Shoe store',
                'Boot store', 'Sneaker store', 'Lingerie store', 'Underwear store', 'Swimwear store',
                'Formal wear store', 'Bridal shop', 'Tuxedo rental', 'Costume store', 'Uniform store'
            ],
            'Electronics & Computers': [
                'Electronics store', 'Computer store', 'Mobile phone store', 'Camera store',
                'Audio equipment store', 'Home theater store', 'Video game store', 'Appliance store',
                'Television store', 'Laptop store', 'Tablet store', 'Smartwatch store'
            ],
            'Home & Garden': [
                'Furniture store', 'Home goods store', 'Kitchen supply store', 'Bedding store',
                'Bath store', 'Hardware store', 'Garden center', 'Plant nursery', 'Florist',
                'Home improvement store', 'Paint store', 'Lighting store', 'Carpet store',
                'Curtain store', 'Wallpaper store', 'Home decor store'
            ],
            'Grocery & Food Stores': [
                'Supermarket', 'Grocery store', 'Convenience store', 'Organic food store',
                'Health food store', 'Butcher shop', 'Fish market', 'Seafood market',
                'Fruit and vegetable store', 'Bakery', 'Cheese shop', 'Wine store',
                'Liquor store', 'Beer store', 'Specialty food store', 'Gourmet grocery store'
            ],
            'Specialty Shops': [
                'Bookstore', 'Gift shop', 'Toy store', 'Pet store', 'Jewelry store',
                'Watch store', 'Antique store', 'Art gallery', 'Craft store', 'Hobby shop',
                'Music store', 'Sporting goods store', 'Outdoor store', 'Bike shop'
            ]
        }
    },
    'Services': {
        icon: '🔧',
        color: '#FFF0E5',
        subcategories: {
            'Beauty & Personal Care': [
                'Hair salon', 'Barber shop', 'Beauty salon', 'Nail salon', 'Spa', 'Day spa',
                'Massage spa', 'Facial spa', 'Waxing salon', 'Eyebrow bar', 'Eyelash salon',
                'Tanning salon', 'Tattoo shop', 'Piercing shop', 'Makeup artist'
            ],
            'Automotive': [
                'Auto repair shop', 'Car wash', 'Oil change service', 'Tire shop', 'Auto body shop',
                'Auto detailing service', 'Mechanic', 'Transmission shop', 'Brake shop',
                'Muffler shop', 'Auto glass shop', 'Car dealer', 'Used car dealer'
            ],
            'Home Services': [
                'Plumber', 'Electrician', 'HVAC contractor', 'Carpenter', 'Painter',
                'Locksmith', 'Cleaning service', 'Pest control', 'Landscaper', 'Lawn care',
                'Roofing contractor', 'General contractor', 'Handyman'
            ],
            'Professional Services': [
                'Lawyer', 'Attorney', 'Accountant', 'Tax consultant', 'Financial advisor',
                'Insurance agency', 'Real estate agent', 'Notary public', 'Consultant',
                'Marketing agency', 'Advertising agency', 'Web designer', 'Graphic designer'
            ]
        }
    },
    'Education': {
        icon: '🎓',
        color: '#E8E0F4',
        isProfessional: true,
        allowsBooking: true,
        subcategories: {
            'Schools': [
                'School', 'Elementary school', 'Middle school', 'High school', 'Private school',
                'Public school', 'Charter school', 'Montessori school', 'Preschool', 'Kindergarten',
                'Day care center', 'After school program'
            ],
            'Higher Education': [
                'University', 'College', 'Community college', 'Technical school', 'Vocational school',
                'Graduate school', 'Business school', 'Law school', 'Medical school', 'Art school',
                'Music school', 'Culinary school', 'Trade school'
            ],
            'Training & Tutoring': [
                'Tutoring service', 'Test preparation center', 'Language school', 'Driving school',
                'Dance school', 'Music lessons', 'Art classes', 'Cooking classes', 'Fitness classes',
                'Yoga studio', 'Martial arts school', 'Swimming school'
            ]
        }
    },
    'Entertainment & Recreation': {
        icon: '🎬',
        color: '#D4F1F4',
        subcategories: {
            'Entertainment Venues': [
                'Movie theater', 'Theater', 'Concert hall', 'Comedy club', 'Amusement park',
                'Water park', 'Zoo', 'Aquarium', 'Museum', 'Art gallery', 'Planetarium',
                'Bowling alley', 'Arcade', 'Laser tag center', 'Escape room', 'Karaoke'
            ],
            'Sports & Fitness': [
                'Gym', 'Fitness center', 'Yoga studio', 'Pilates studio', 'CrossFit gym',
                'Boxing gym', 'Martial arts school', 'Dance studio', 'Swimming pool',
                'Tennis court', 'Basketball court', 'Golf course', 'Driving range',
                'Sports club', 'Recreation center'
            ],
            'Outdoor Recreation': [
                'Park', 'Playground', 'Dog park', 'Hiking trail', 'Bike trail', 'Beach',
                'Lake', 'Campground', 'RV park', 'Marina', 'Boat rental', 'Fishing spot',
                'Ski resort', 'Skate park'
            ]
        }
    },
    'Lodging': {
        icon: '🏨',
        color: '#FFE5E5',
        subcategories: {
            'Hotels & Accommodations': [
                'Hotel', 'Motel', 'Resort', 'Bed & breakfast', 'Inn', 'Hostel',
                'Extended stay hotel', 'Boutique hotel', 'Luxury hotel', 'Budget hotel',
                'Airport hotel', 'Casino hotel', 'Spa hotel', 'Beach resort', 'Mountain resort'
            ],
            'Vacation Rentals': [
                'Vacation home rental', 'Apartment rental', 'Condo rental', 'Villa rental',
                'Cabin rental', 'Cottage rental', 'Chalet', 'Timeshare', 'Serviced apartment'
            ]
        }
    },
    'Transportation': {
        icon: '🚗',
        color: '#E0EFFF',
        subcategories: {
            'Public Transportation': [
                'Bus station', 'Train station', 'Subway station', 'Airport', 'Ferry terminal',
                'Taxi stand', 'Taxi service', 'Limousine service', 'Shuttle service'
            ],
            'Vehicle Services': [
                'Gas station', 'Electric vehicle charging station', 'Parking lot', 'Parking garage',
                'Car rental', 'Truck rental', 'RV rental', 'Motorcycle rental', 'Bike rental',
                'Scooter rental', 'Car sharing', 'Ride share'
            ]
        }
    }
};

async function seedCategories() {
    console.log('🌱 Seeding GMB categories...\n');

    let totalCategories = 0;
    let rootCount = 0;
    let mainCount = 0;
    let subCount = 0;

    try {
        for (const [rootName, rootData] of Object.entries(categoryHierarchy)) {
            const rootSlug = rootName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

            // Insert root category (Level 0)
            const rootResult = await sql`
        INSERT INTO category_hierarchy (
          name, slug, parent_id, level, icon, color, 
          is_professional_service, allows_booking, display_order
        ) VALUES (
          ${rootName},
          ${rootSlug},
          NULL,
          0,
          ${rootData.icon},
          ${rootData.color},
          ${(rootData as any).isProfessional || false},
          ${(rootData as any).allowsBooking || false},
          ${rootCount}
        )
        RETURNING id
      `;

            const rootId = rootResult[0].id;
            rootCount++;
            totalCategories++;

            console.log(`✅ Created root category: ${rootName} (ID: ${rootId})`);

            // Insert main categories (Level 1) and subcategories (Level 2)
            let mainOrder = 0;
            for (const [mainName, subcategories] of Object.entries(rootData.subcategories)) {
                const mainSlug = `${rootSlug}-${mainName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

                const mainResult = await sql`
          INSERT INTO category_hierarchy (
            name, slug, parent_id, level, icon, color,
            is_professional_service, allows_booking, display_order
          ) VALUES (
            ${mainName},
            ${mainSlug},
            ${rootId},
            1,
            ${rootData.icon},
            ${rootData.color},
            ${(rootData as any).isProfessional || false},
            ${(rootData as any).allowsBooking || false},
            ${mainOrder}
          )
          RETURNING id
        `;

                const mainId = mainResult[0].id;
                mainCount++;
                totalCategories++;
                mainOrder++;

                console.log(`  ├─ ${mainName} (${subcategories.length} subcategories)`);

                // Insert subcategories (Level 2)
                let subOrder = 0;
                for (const subName of subcategories) {
                    const subSlug = `${mainSlug}-${subName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

                    await sql`
            INSERT INTO category_hierarchy (
              name, slug, parent_id, level, icon, color,
              is_professional_service, allows_booking, display_order
            ) VALUES (
              ${subName},
              ${subSlug},
              ${mainId},
              2,
              ${rootData.icon},
              ${rootData.color},
          ${(rootData as any).isProfessional || false},
          ${(rootData as any).allowsBooking || false},
              ${subOrder}
            )
            ON CONFLICT (slug) DO NOTHING
          `;

                    subCount++;
                    totalCategories++;
                    subOrder++;
                }
            }

            console.log('');
        }

        console.log('🎉 Category seeding completed!\n');
        console.log('📊 Summary:');
        console.log(`   - Root categories: ${rootCount}`);
        console.log(`   - Main categories: ${mainCount}`);
        console.log(`   - Subcategories: ${subCount}`);
        console.log(`   - Total categories: ${totalCategories}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedCategories();
