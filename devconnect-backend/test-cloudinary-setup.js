import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Cloudinary Configuration...\n');

// Test configuration
const testCloudinaryConfig = () => {
  try {
    // Configure cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    console.log('✅ Cloudinary configuration loaded successfully');
    console.log(`📊 Cloud Name: ${process.env.CLOUDINARY_NAME}`);
    console.log(`🔑 API Key: ${process.env.CLOUDINARY_API_KEY?.substring(0, 8)}...`);
    console.log(`🔐 API Secret: ${process.env.CLOUDINARY_SECRET?.substring(0, 8)}...`);
    
    return true;
  } catch (error) {
    console.error('❌ Error configuring Cloudinary:', error.message);
    return false;
  }
};

// Test connection
const testCloudinaryConnection = async () => {
  try {
    console.log('\n🔄 Testing Cloudinary connection...');
    
    // Test ping
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('📡 Ping response:', result.status);
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting Cloudinary Configuration Tests...\n');
  
  const configTest = testCloudinaryConfig();
  if (configTest) {
    await testCloudinaryConnection();
  }
  
  console.log('\n🎯 Test completed!');
};

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testCloudinaryConfig, testCloudinaryConnection };
