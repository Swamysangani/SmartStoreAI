const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const generateMonthlyRevenue = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 5000) + 500
  }));
};

const products = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Experience premium sound quality with active noise cancellation and a comfortable over-ear design.',
    category: 'Electronics',
    tags: ['audio', 'wireless', 'headphones', 'premium'],
    marketingCaption: 'Immerse Yourself in Sound',
    price: 299.99,
    stock: 45,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Smart Fitness Watch Series 6',
    description: 'Track your workouts, monitor your heart rate, and receive notifications on your wrist.',
    category: 'Wearables',
    tags: ['fitness', 'smartwatch', 'health'],
    marketingCaption: 'Your Ultimate Fitness Companion',
    price: 199.50,
    stock: 120,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable lumbar support, breathable mesh back, and comfortable seating for long hours.',
    category: 'Furniture',
    tags: ['office', 'chair', 'ergonomic', 'wfh'],
    marketingCaption: 'Work in Absolute Comfort',
    price: 249.00,
    stock: 30,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: '4K Ultra HD Smart TV - 55"',
    description: 'Stunning 4K resolution with built-in streaming apps and voice control.',
    category: 'Electronics',
    tags: ['tv', '4k', 'smart home', 'entertainment'],
    marketingCaption: 'Cinematic Experience at Home',
    price: 499.99,
    stock: 15,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Professional Espresso Machine',
    description: 'Brew cafe-quality espresso and froth milk like a barista with this stainless steel machine.',
    category: 'Home Appliances',
    tags: ['coffee', 'espresso', 'kitchen', 'appliance'],
    marketingCaption: 'Be Your Own Barista',
    price: 349.99,
    stock: 25,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Customizable RGB backlighting and tactile mechanical switches for rapid keystrokes.',
    category: 'Gaming',
    tags: ['keyboard', 'gaming', 'rgb', 'mechanical'],
    marketingCaption: 'Level Up Your Gameplay',
    price: 129.99,
    stock: 80,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Organic Skincare Gift Set',
    description: 'A complete set of natural, cruelty-free skincare products for a radiant glow.',
    category: 'Beauty',
    tags: ['skincare', 'organic', 'beauty', 'gift'],
    marketingCaption: 'Natural Radiance Awaits',
    price: 89.00,
    stock: 60,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Durable Yoga Mat',
    description: 'Non-slip surface and extra cushioning for perfect balance and comfort.',
    category: 'Fitness',
    tags: ['yoga', 'fitness', 'workout', 'accessories'],
    marketingCaption: 'Find Your Balance',
    price: 29.99,
    stock: 200,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Smart Home Security Camera',
    description: '1080p HD video, two-way audio, and night vision to keep your home safe.',
    category: 'Smart Home',
    tags: ['security', 'camera', 'smart home'],
    marketingCaption: 'Peace of Mind, Anywhere',
    price: 79.99,
    stock: 150,
    monthlyRevenue: generateMonthlyRevenue()
  },
  {
    name: 'Premium Leather Wallet',
    description: 'Handcrafted leather wallet with RFID blocking technology and multiple card slots.',
    category: 'Accessories',
    tags: ['wallet', 'leather', 'accessories', 'rfid'],
    marketingCaption: 'Elegance Meets Security',
    price: 49.50,
    stock: 90,
    monthlyRevenue: generateMonthlyRevenue()
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
