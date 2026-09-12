const mongoose = require('mongoose');

const DEFAULT_MONGODB_URI = 'mongodb+srv://afiajabin12_db_user:ecocycle@cluster0.txja4oy.mongodb.net/ecocycle?retryWrites=true&w=majority&appName=Cluster0';

/**
 * Connect to MongoDB Database
 * Supports local MongoDB and MongoDB Atlas cloud database.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('👉 Tip: Make sure your MongoDB service is running locally, or check your MongoDB Atlas connection string in server/.env');
    process.exit(1);
  }
};

module.exports = connectDB;
