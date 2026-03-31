import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import Testimonial from './models/Testimonial.js';
import AdminUser from './models/AdminUser.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creamy-cravings';

const products = [
  {
    name: 'Classic New York',
    description: 'Our signature creamy cheesecake with a graham cracker crust. Rich, smooth, and absolutely divine.',
    price: 45,
    category: '9inch',
    flavors: ['Classic'],
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600',
    badge: 'most-loved',
    available: true,
    calories: 320,
    ingredients: ['Cream Cheese', 'Graham Crackers', 'Sugar', 'Eggs', 'Vanilla Extract', 'Heavy Cream'],
    featured: true
  },
  {
    name: 'Strawberry Swirl',
    description: 'Fresh strawberry puree swirled through our classic cheesecake batter, topped with glazed strawberries.',
    price: 48,
    category: '9inch',
    flavors: ['Strawberry'],
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600',
    badge: 'top-rated',
    available: true,
    calories: 310,
    ingredients: ['Cream Cheese', 'Fresh Strawberries', 'Graham Crackers', 'Sugar', 'Eggs'],
    featured: true
  },
  {
    name: 'Chocolate Truffle',
    description: 'Decadent chocolate cheesecake with a cookie crust, topped with chocolate ganache.',
    price: 50,
    category: '9inch',
    flavors: ['Chocolate'],
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    badge: 'most-loved',
    available: true,
    calories: 380,
    ingredients: ['Cream Cheese', 'Dark Chocolate', 'Oreos', 'Sugar', 'Heavy Cream', 'Eggs'],
    featured: true
  },
  {
    name: 'Mango Tango',
    description: 'Tropical mango cheesecake with a coconut crust, topped with fresh mango slices.',
    price: 48,
    category: '9inch',
    flavors: ['Mango', 'Coconut'],
    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600',
    badge: null,
    available: true,
    calories: 295,
    ingredients: ['Cream Cheese', 'Mango Puree', 'Coconut', 'Graham Crackers', 'Sugar'],
    featured: true
  },
  {
    name: 'Salted Caramel',
    description: 'Buttery caramel cheesecake with a hint of sea salt, topped with caramel drizzle.',
    price: 52,
    category: '9inch',
    flavors: ['Caramel'],
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600',
    badge: 'top-rated',
    available: true,
    calories: 360,
    ingredients: ['Cream Cheese', 'Caramel', 'Sea Salt', 'Graham Crackers', 'Sugar', 'Heavy Cream'],
    featured: true
  },
  {
    name: 'Bambino - Vanilla Bean',
    description: 'Classic vanilla bean mini cheesecake, perfect for a single indulgence.',
    price: 8,
    category: 'bambinos',
    flavors: ['Vanilla'],
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600',
    badge: null,
    available: true,
    calories: 180,
    ingredients: ['Cream Cheese', 'Vanilla Bean', 'Graham Crackers', 'Sugar', 'Eggs'],
    featured: false
  },
  {
    name: 'Bambino - Chocolate',
    description: 'Rich chocolate mini cheesecake with a cookie crumb base.',
    price: 9,
    category: 'bambinos',
    flavors: ['Chocolate'],
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600',
    badge: null,
    available: true,
    calories: 195,
    ingredients: ['Cream Cheese', 'Cocoa', 'Chocolate Cookies', 'Sugar', 'Eggs'],
    featured: false
  },
  {
    name: 'Bambino - Strawberry',
    description: 'Mini cheesecake topped with fresh strawberry compote.',
    price: 9,
    category: 'bambinos',
    flavors: ['Strawberry'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
    badge: 'new',
    available: true,
    calories: 175,
    ingredients: ['Cream Cheese', 'Strawberries', 'Graham Crackers', 'Sugar', 'Eggs'],
    featured: true
  },
  {
    name: 'Bambino - Salted Caramel',
    description: 'Mini caramel cheesecake with a sprinkle of sea salt.',
    price: 10,
    category: 'bambinos',
    flavors: ['Caramel'],
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600',
    badge: null,
    available: true,
    calories: 190,
    ingredients: ['Cream Cheese', 'Caramel', 'Sea Salt', 'Graham Crackers', 'Sugar'],
    featured: false
  },
  {
    name: 'Poppers 6-Pack - Original',
    description: 'Six bite-sized original cheesecake pops. Perfect for parties!',
    price: 18,
    category: 'poppers',
    flavors: ['Classic'],
    image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600',
    badge: 'most-loved',
    available: true,
    calories: 240,
    ingredients: ['Cream Cheese', 'Graham Crackers', 'Sugar', 'Eggs'],
    featured: true
  },
  {
    name: 'Poppers 6-Pack - Chocolate',
    description: 'Six chocolate-dipped cheesecake bites on a stick.',
    price: 20,
    category: 'poppers',
    flavors: ['Chocolate'],
    image: 'https://images.unsplash.com/photo-1559617634-8930eb4384bd?w=600',
    badge: null,
    available: true,
    calories: 260,
    ingredients: ['Cream Cheese', 'Chocolate Coating', 'Graham Crackers', 'Sugar'],
    featured: false
  },
  {
    name: 'Poppers 6-Pack - Strawberry',
    description: 'Six strawberry cheesecake pops with a pink coating.',
    price: 20,
    category: 'poppers',
    flavors: ['Strawberry'],
    image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600',
    badge: null,
    available: true,
    calories: 250,
    ingredients: ['Cream Cheese', 'Strawberry', 'White Chocolate', 'Graham Crackers', 'Sugar'],
    featured: false
  },
  {
    name: 'Pumpkin Spice',
    description: 'Seasonal pumpkin cheesecake with warm spices and whipped cream.',
    price: 48,
    category: 'seasonal',
    flavors: ['Pumpkin', 'Spice'],
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600',
    badge: 'new',
    available: true,
    calories: 340,
    ingredients: ['Cream Cheese', 'Pumpkin Puree', 'Cinnamon', 'Nutmeg', 'Graham Crackers', 'Sugar'],
    featured: true
  },
  {
    name: 'Peppermint White Chocolate',
    description: 'Festive peppermint cheesecake with white chocolate swirls.',
    price: 50,
    category: 'seasonal',
    flavors: ['Peppermint', 'White Chocolate'],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600',
    badge: null,
    available: true,
    calories: 350,
    ingredients: ['Cream Cheese', 'White Chocolate', 'Peppermint', 'Graham Crackers', 'Sugar'],
    featured: true
  },
  {
    name: 'Custom Creation',
    description: 'Design your own cheesecake with your choice of flavor, toppings, and decorations.',
    price: 55,
    category: 'special',
    flavors: ['Custom'],
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600',
    badge: null,
    available: true,
    calories: 0,
    ingredients: ['Custom Selection'],
    featured: true
  }
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    quote: 'The best cheesecake I have ever tasted! The texture is perfectly creamy and the crust is divine. My entire family is obsessed!',
    product: 'Classic New York'
  },
  {
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    quote: 'I ordered the Chocolate Truffle for my wife birthday and she said it was the best dessert she has ever had. Will definitely order again!',
    product: 'Chocolate Truffle'
  },
  {
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    quote: 'The Strawberry Swirl is incredible! Fresh, light, and not too sweet. Perfect for spring celebrations.',
    product: 'Strawberry Swirl'
  },
  {
    name: 'Michael Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 5,
    quote: 'These bambinos are the perfect single-serving treat. The Salted Caramel is my absolute favorite!',
    product: 'Bambino - Salted Caramel'
  },
  {
    name: 'Jessica Williams',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5,
    quote: 'The poppers were a hit at our party! Everyone asked where I got them. Fresh, delicious, and beautifully packaged.',
    product: 'Poppers 6-Pack - Original'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    await Testimonial.deleteMany({});
    
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    
    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded successfully');

    // Create a default admin user (used by the day-1 admin panel).
    // For local development, you can set:
    // ADMIN_EMAIL=...
    // ADMIN_PASSWORD=...
    const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@creamycravings.com').toLowerCase().trim();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

    const existingAdmin = await AdminUser.findOne({ email: ADMIN_EMAIL });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await AdminUser.create({ email: ADMIN_EMAIL, passwordHash });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists (skipping creation)');
    }
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
