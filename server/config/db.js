// server/config/db.js
const mongoose = require('mongoose');

// For serverless: cache the database connection
let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

const connectDB = async () => {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    connectionAttempts++;
    console.log(`MongoDB connection attempt ${connectionAttempts}`);

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 1, // Minimize connections in serverless
      family: 4 // Force IPv4
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    isConnected = true;
    connectionAttempts = 0;
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle disconnection events
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    // Handle error events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    
    // Implement retry logic
    if (connectionAttempts < MAX_RETRIES) {
      console.log(`Retrying connection... (${connectionAttempts}/${MAX_RETRIES})`);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectDB();
    }
    
    // In serverless, don't terminate the process
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    
    throw error;
  }
};

module.exports = connectDB;