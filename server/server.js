const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Make uploads directory static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Initialize categories if they don't exist (for development purposes)
const Category = require('./models/Category');
const initializeCategories = async () => {
  try {
    const count = await Category.countDocuments();
    
    if (count === 0) {
      console.log('No categories found. Creating default categories...');
      const defaultCategories = [
        { name: 'Electronics', icon: 'FaMobile', color: '#3B82F6', slug: 'electronics' },
        { name: 'Vehicles', icon: 'FaCar', color: '#EF4444', slug: 'vehicles' },
        { name: 'Property', icon: 'FaHome', color: '#10B981', slug: 'property' },
        { name: 'Furniture', icon: 'FaCouch', color: '#F59E0B', slug: 'furniture' },
        { name: 'Jobs', icon: 'FaBriefcase', color: '#8B5CF6', slug: 'jobs' },
        { name: 'Services', icon: 'FaTools', color: '#EC4899', slug: 'services' },
        { name: 'Fashion', icon: 'FaTshirt', color: '#6366F1', slug: 'fashion' },
        { name: 'Books', icon: 'FaBook', color: '#F97316', slug: 'books' }
      ];
      
      await Category.insertMany(defaultCategories);
      console.log('Default categories created successfully!');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

// Call the function to initialize categories
initializeCategories();