// server/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const colors = require('colors');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Category = require('./models/Category');
const Listing = require('./models/Listing');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    location: 'San Francisco, CA',
    bio: 'App administrator and developer'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    location: 'New York, NY',
    bio: 'Passionate about vintage collectibles and tech gadgets'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    location: 'Boston, MA',
    bio: 'Interior designer looking for unique home items'
  }
];

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Laptops, phones, tablets, and other electronic devices',
    icon: 'laptop',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, motorcycles, bikes, and other vehicles',
    icon: 'car',
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    description: 'Sofas, beds, chairs, tables, and other furniture',
    icon: 'couch',
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Properties',
    slug: 'properties',
    description: 'Houses, apartments, land, and other properties',
    icon: 'home',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, accessories, and more',
    icon: 'tshirt',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment, outdoor gear, and related items',
    icon: 'basketball-ball',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Collectibles',
    slug: 'collectibles',
    description: 'Antiques, art, coins, stamps, and other collectibles',
    icon: 'gem',
    color: 'from-pink-500 to-pink-600'
  },
  {
    name: 'Jobs',
    slug: 'jobs',
    description: 'Job offerings and services',
    icon: 'briefcase',
    color: 'from-teal-500 to-teal-600'
  }
];

const subcategories = [
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Laptops and notebooks',
    parentSlug: 'electronics',
    color: 'from-blue-400 to-blue-500'
  },
  {
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Mobile phones and accessories',
    parentSlug: 'electronics',
    color: 'from-blue-400 to-blue-500'
  },
  {
    name: 'Cars',
    slug: 'cars',
    description: 'Used and new cars for sale',
    parentSlug: 'vehicles',
    color: 'from-red-400 to-red-500'
  },
  {
    name: 'Sofas',
    slug: 'sofas',
    description: 'Couches, sofas, and sectionals',
    parentSlug: 'furniture',
    color: 'from-green-400 to-green-500'
  },
  {
    name: 'Full-time',
    slug: 'full-time',
    description: 'Full-time job opportunities',
    parentSlug: 'jobs',
    color: 'from-teal-400 to-teal-500'
  }
];

// Import data
const importData = async () => {
  try {
    // Clear database
    await User.deleteMany();
    await Category.deleteMany();
    await Listing.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Insert categories
    const createdCategories = [];
    for (let category of categories) {
      const { _id } = await Category.create(category);
      createdCategories.push({ slug: category.slug, _id });
    }

    // Insert subcategories
    for (let subcategory of subcategories) {
      const parentCategory = createdCategories.find(
        c => c.slug === subcategory.parentSlug
      );
      
      if (parentCategory) {
        const { parentSlug, ...subcategoryData } = subcategory;
        await Category.create({
          ...subcategoryData,
          parent: parentCategory._id
        });
      }
    }

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Listing.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Run command
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}