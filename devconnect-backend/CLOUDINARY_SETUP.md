# Cloudinary Setup Guide

## Fix for "Upload failed: Unknown API key your_api_key"

The issue has been resolved by updating the Cloudinary configuration to properly handle the Cloudinary URL format.

## Configuration Options

### Option 1: Use Cloudinary URL (Recommended)
Add this to your `.env.local` file:
```
CLOUDINARY_URL=cloudinary://139924396781628:U2CsjQgshYRrymPoZ-shG5dzrms@djg7rpdpi
```

### Option 2: Use Individual Variables
Alternatively, you can use individual environment variables:
```
CLOUDINARY_NAME=djg7rpdpi
CLOUDINARY_API_KEY=139924396781628
CLOUDINARY_SECRET=U2CsjQgshYRrymPoZ-shG5dzrms
```

## Verification

To verify the setup is working correctly, you can run:
```bash
node test-cloudinary-setup.js
```

This will test the Cloudinary connection and confirm if the configuration is valid.
