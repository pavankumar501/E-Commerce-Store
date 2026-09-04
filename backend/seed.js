import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: 'laptop', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Fashion', slug: 'fashion', icon: 'shirt', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
  { name: 'Books', slug: 'books', icon: 'book', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', icon: 'dumbbell', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { name: 'Grocery', slug: 'grocery', icon: 'shopping-cart', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' }
];

const products = [
  { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', description: 'Samsung Galaxy S24 Ultra with S Pen, 200MP camera, Snapdragon 8 Gen 3 processor, 5000mAh battery, 6.8 inch Dynamic AMOLED display.', price: 134999, discountPrice: 119999, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', category: 'electronics', brand: 'Samsung', stock: 50 },
  { name: 'Apple iPhone 15 Pro Max', slug: 'apple-iphone-15-pro-max', description: 'Apple iPhone 15 Pro Max with A17 Pro chip, 48MP camera system, titanium design, USB-C, 6.7 inch Super Retina XDR display.', price: 159900, discountPrice: 149900, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', category: 'electronics', brand: 'Apple', stock: 30 },
  { name: 'Sony WH-1000XM5 Headphones', slug: 'sony-wh1000xm5', description: 'Industry leading noise cancellation headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours battery.', price: 34990, discountPrice: 26990, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'electronics', brand: 'Sony', stock: 75 },
  { name: 'OnePlus 12 5G', slug: 'oneplus-12-5g', description: 'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera, 5400mAh battery, 100W SUPERVOOC charging, 6.82 inch 2K AMOLED display.', price: 64999, discountPrice: 59999, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', category: 'electronics', brand: 'OnePlus', stock: 40 },
  { name: 'Boat Airdopes 141', slug: 'boat-airdopes-141', description: 'boAt Airdopes 141 TWS earbuds with ENx noise cancellation, 42H playback, IWP technology, IPX4 water resistance.', price: 1499, discountPrice: 999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400', category: 'electronics', brand: 'Boat', stock: 200 },
  { name: 'Levi\'s Men Regular Fit Jeans', slug: 'levis-regular-fit-jeans', description: 'Levi\'s 511 Regular Fit jeans made with stretchable denim fabric. Classic blue wash with signature tab branding.', price: 3999, discountPrice: 2799, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', category: 'fashion', brand: 'Levis', stock: 100 },
  { name: 'Nike Air Max 270', slug: 'nike-air-max-270', description: 'Nike Air Max 270 running shoes with Max Air unit for unrivalled cushioning, breathable mesh upper, rubber outsole.', price: 13995, discountPrice: 10497, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'fashion', brand: 'Nike', stock: 60 },
  { name: 'Allen Solly Men Formal Shirt', slug: 'allen-solly-formal-shirt', description: 'Allen Solly Slim Fit formal shirt in cotton blend fabric. Perfect for office wear with wrinkle-free technology.', price: 2499, discountPrice: 1749, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', category: 'fashion', brand: 'Allen Solly', stock: 80 },
  { name: 'Bombay Dyeing Bedsheet Set', slug: 'bombay-dyeing-bedsheet', description: 'Premium double bedsheet set with 2 pillow covers. 100% cotton with 200TC weave. Machine washable, colorfast.', price: 2999, discountPrice: 1999, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400', category: 'home-kitchen', brand: 'Bombay Dyeing', stock: 120 },
  { name: 'Prestige Induction Cooktop', slug: 'prestige-induction-cooktop', description: 'Prestige PIC 16.0+ induction cooktop with power consumption of 1900W, Indian menu options, push button controls.', price: 3295, discountPrice: 2695, image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400', category: 'home-kitchen', brand: 'Prestige', stock: 45 },
  { name: 'IKEA KALLAX Shelf Unit', slug: 'ikea-kallax-shelf', description: 'KALLAX shelf unit in white. 4x2 grid design, versatile storage for books, media, or decorative items. 77cm x 147cm.', price: 8999, discountPrice: 7999, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', category: 'home-kitchen', brand: 'IKEA', stock: 25 },
  { name: 'Patanjali Chyawanprash', slug: 'patanjali-chyawanprash', description: 'Patanjali Chyawanprash 1kg with amla and 48 herbs. Boosts immunity and respiratory health. Natural ingredients.', price: 295, discountPrice: 245, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', category: 'grocery', brand: 'Patanjali', stock: 500 },
  { name: 'Tata Sampann Turmeric Powder', slug: 'tata-sampann-turmeric', description: 'Tata Sampann Turmeric Powder 200g. Pure and unpolished with high curcumin content. No added artificial colours.', price: 145, discountPrice: 125, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', category: 'grocery', brand: 'Tata', stock: 300 },
  { name: 'MRF Bat English Willow', slug: 'mrf-bat-english-willow', description: 'MRF Genius Grand Plus English Willow Cricket Bat. Short handle, suitable for leather ball. Grade 1 willow.', price: 12999, discountPrice: 10499, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', category: 'sports-fitness', brand: 'MRF', stock: 20 },
  { name: 'Lifelong Adjustable Dumbbells', slug: 'lifelong-dumbbells', description: 'Lifelong adjustable dumbbells set of 2 (20kg each). Cast iron plates, chrome plated handle. Home gym essential.', price: 3499, discountPrice: 2799, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400', category: 'sports-fitness', brand: 'Lifelong', stock: 35 },
  { name: 'Himalaya Wellness Protein Powder', slug: 'himalaya-protein-powder', description: 'Himalaya Wellness Pure Protein powder 1kg. Whey protein with 24g protein per serving. Chocolate flavour.', price: 1899, discountPrice: 1599, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c026?w=400', category: 'sports-fitness', brand: 'Himalaya', stock: 60 },
  { name: 'NCERT Class 12 Physics Textbook', slug: 'ncert-physics-class12', description: 'NCERT textbook for Class 12 Physics. Updated syllabus as per CBSE 2024-25. Essential for board exams and competitive exams.', price: 320, discountPrice: 280, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', category: 'books', brand: 'NCERT', stock: 200 },
  { name: 'Atomic Habits by James Clear', slug: 'atomic-habits-james-clear', description: 'Atomic Habits by James Clear - an easy and proven way to build good habits and break bad ones. Paperback edition.', price: 599, discountPrice: 449, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', category: 'books', brand: 'Penguin', stock: 150 },
  { name: 'The Psychology of Money', slug: 'psychology-of-money', description: 'The Psychology of Money by Morgan Housel. Timeless lessons on wealth, greed, and happiness. 20 timeless lessons.', price: 399, discountPrice: 319, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400', category: 'books', brand: 'Jaico', stock: 180 },
  { name: 'ASUS ROG Strix Gaming Laptop', slug: 'asus-rog-strix', description: 'ASUS ROG Strix G16 with Intel i9-14900HX, RTX 4070, 16GB RAM, 1TB SSD, 16 inch QHD 240Hz display.', price: 164999, discountPrice: 149999, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', category: 'electronics', brand: 'ASUS', stock: 15 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@shophub.in',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      address: { street: 'MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9876543210' }
    });
    console.log('Admin user created');

    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '9876543211',
      address: { street: '123 Nehru Nagar', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '9876543211' }
    });
    console.log('Customer user created');

    const createdCategories = {};
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories[cat.slug] = created._id;
    }
    console.log(`${categories.length} categories created`);

    for (const prod of products) {
      await Product.create({
        ...prod,
        category: createdCategories[prod.category]
      });
    }
    console.log(`${products.length} products created`);

    console.log('\nSeeding complete!');
    console.log('Admin login: admin@shophub.in / admin123');
    console.log('Customer login: rahul@example.com / customer123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
