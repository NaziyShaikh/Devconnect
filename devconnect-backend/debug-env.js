import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Environment Variables Debug...\n');

// Check Cloudinary variables
console.log('Cloudinary Configuration:');
console.log(`CLOUDINARY_NAME: ${process.env.CLOUDINARY_NAME ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDINARY_URL: ${process.env.CLOUDINARY_URL ? '✅ Set' : '❌ Missing'}`);

// Check other important variables
console.log('\nOther Configuration:');
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`PORT: ${process.env.PORT || '5001 (default)'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development (default)'}`);
console.log(`CLIENT_URL: ${process.env.CLIENT_URL || 'http://localhost:3000 (default)'}`);

console.log('\n🎯 Debug completed!');
