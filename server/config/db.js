// server/config/db.js
const mongoose = require('mongoose');

// Global promise to track connection status
let cachedConnection = null;

const connectDB = async () => {
  try {
    if (cachedConnection) {
      console.log('Using existing MongoDB connection');
      return cachedConnection;
    }
    
    console.log('Connecting to MongoDB Atlas...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    cachedConnection = conn;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process in serverless environments
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;