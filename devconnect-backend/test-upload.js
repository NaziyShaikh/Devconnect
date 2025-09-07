import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Cloudinary Upload Functionality...\n');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test upload with a small base64 image
const testUpload = async () => {
  try {
    console.log('📤 Testing image upload to Cloudinary...');

    // Create a small test image (1x1 pixel PNG in base64)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const result = await cloudinary.uploader.upload(testImage, {
      resource_type: "auto",
      folder: "devconnect-test"
    });

    console.log('✅ Upload successful!');
    console.log('📡 Public URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);

    return true;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
};

// Test configuration
const testConfig = () => {
  console.log('🔧 Cloudinary Configuration:');
  console.log(`   Cloud Name: ${process.env.CLOUDINARY_NAME}`);
  console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY?.substring(0, 8)}...`);
  console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET?.substring(0, 8)}...`);
  console.log(`   CLOUDINARY_URL: ${process.env.CLOUDINARY_URL}`);
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting Upload Tests...\n');

  testConfig();
  console.log('');

  const uploadSuccess = await testUpload();

  console.log('\n🎯 Test completed!');
  if (uploadSuccess) {
    console.log('✅ All tests passed! Upload functionality should work.');
  } else {
    console.log('❌ Tests failed. Check your Cloudinary configuration.');
  }
};

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testUpload, testConfig };
