import mongoose from 'mongoose';

export const connectDB = async () => {
  console.log('🔍 Attempting to connect to MongoDB...');
  
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is not defined');
    console.error('Please add MONGO_URI to your .env file');
    console.error('Example: MONGO_URI=mongodb://localhost:27017/devconnect');
    process.exit(1);
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📍 Port: ${conn.connection.port}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`Error: ${err.message}`);
    console.error('Please check:');
    console.error('1. MongoDB service is running');
    console.error('2. Connection string is correct');
    console.error('3. Network connectivity');
    process.exit(1);
  }
};
