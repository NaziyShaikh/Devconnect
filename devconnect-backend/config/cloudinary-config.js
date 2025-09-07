import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Parse Cloudinary URL if provided
let cloudinaryConfig = {};
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudinaryUrl) {
  // Parse Cloudinary URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  const urlParts = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (urlParts) {
    cloudinaryConfig = {
      api_key: urlParts[1],
      api_secret: urlParts[2],
      cloud_name: urlParts[3]
    };
  }
} else {
  // Use individual environment variables as fallback
  cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_SECRET || process.env.CLOUD_SECRET,
  };
}

// Validate configuration
const validateCloudinaryConfig = () => {
  const { cloud_name, api_key, api_secret } = cloudinaryConfig;
  
  if (!cloud_name || !api_key || !api_secret) {
    console.error('❌ Cloudinary configuration is incomplete!');
    console.error('Please set either:');
    console.error('CLOUDINARY_URL (format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME)');
    console.error('OR individual variables:');
    console.error('CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET');
    return false;
  }
  
  console.log('✅ Cloudinary configuration validated');
  return true;
};

// Configure cloudinary
cloudinary.config(cloudinaryConfig);

export { cloudinary, validateCloudinaryConfig };
export default cloudinary;
