import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  console.log('🧪 Testing MongoDB Atlas Connection...');
  
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is not defined');
    process.exit(1);
  }
  
  try {
    console.log('🔗 Connection String:', process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@'));
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    
    // Test basic operations
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Available Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (err) {
    console.error('❌ MongoDB Atlas Connection Error:');
    console.error(`Error: ${err.message}`);
    
    if (err.message.includes('authentication')) {
      console.error('🔐 Authentication failed - check username/password');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('🌐 Network error - check internet connection');
    } else if (err.message.includes('SRV')) {
      console.error('🔗 DNS resolution failed - check connection string format');
    }
    
    process.exit(1);
  }
};

testConnection();
