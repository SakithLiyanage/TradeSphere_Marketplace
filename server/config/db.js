// server/config/db.js
const mongoose = require('mongoose');

// Cache connection across serverless function invocations
let cachedConnection = null;

const connectDB = async () => {
  // If we have a cached connection, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // Connection options optimized for serverless environments
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT || 60000),
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || 60000),
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || 60000),
      maxPoolSize: 10, // Keep connection pool size appropriate for serverless
      minPoolSize: 1
    };

    // Make connection
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't crash the serverless function
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;