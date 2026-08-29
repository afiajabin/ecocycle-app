const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Supports local MongoDB and MongoDB Atlas cloud database.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('👉 Tip: Make sure your MongoDB service is running locally, or check your MongoDB Atlas connection string in server/.env');
    process.exit(1);
  }
};

module.exports = connectDB;
