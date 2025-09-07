// Cloudinary setup check script
// Run with: node check-cloudinary-setup.js

const fs = require('fs');
const path = require('path');

console.log('=== Cloudinary Setup Check ===\n');

// Check for .env.local file
const envPath = path.join(__dirname, 'devconnect-backend', '.env.local');
const envExamplePath = path.join(__dirname, 'devconnect-backend', '.env.example');

console.log('📁 Checking environment files...');

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📋 Environment variables found:');
  
  if (envContent.includes('CLOUDINARY_NAME=') && !envContent.includes('CLOUDINARY_NAME=your_cloud_name')) {
    console.log('✅ CLOUDINARY_NAME is configured');
  } else {
    console.log('❌ CLOUDINARY_NAME needs to be set');
  }
  
  if (envContent.includes('CLOUDINARY_API_KEY=') && !envContent.includes('CLOUDINARY_API_KEY=your_api_key')) {
    console.log('✅ CLOUDINARY_API_KEY is configured');
  } else {
    console.log('❌ CLOUDINARY_API_KEY needs to be set');
  }
  
  if (envContent.includes('CLOUDINARY_SECRET=') && !envContent.includes('CLOUDINARY_SECRET=your_api_secret')) {
    console.log('✅ CLOUDINARY_SECRET is configured');
  } else {
    console.log('❌ CLOUDINARY_SECRET needs to be set');
  }
  
} else {
  console.log('❌ .env.local file not found');
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copy .env.example to .env.local and update with your Cloudinary credentials');
  }
}

console.log('\n🔧 Cloudinary Setup Instructions:');
console.log('1. Go to https://cloudinary.com/ and create a free account');
console.log('2. Get your Cloud Name, API Key, and API Secret from the dashboard');
console.log('3. Update devconnect-backend/.env.local with your credentials:');
console.log('   CLOUDINARY_NAME=your_actual_cloud_name');
console.log('   CLOUDINARY_API_KEY=your_actual_api_key');
console.log('   CLOUDINARY_SECRET=your_actual_api_secret');
console.log('\n4. Test the setup with: node devconnect-backend/test-cloudinary-setup.js');
