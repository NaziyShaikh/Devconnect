# Cloudinary Setup Guide for DevConnect

## 🔧 The Problem
Your file upload is failing because Cloudinary credentials are not properly configured. The error shows:
```
Unknown API key your_api_key
```

## 🚀 Solution: Configure Cloudinary

### Step 1: Create a Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign Up For Free"
3. Create an account with your email

### Step 2: Get Your Cloudinary Credentials
1. After signing up, go to your Dashboard
2. Find your **Cloud Name**, **API Key**, and **API Secret**
3. These will be displayed on the main dashboard page

### Step 3: Update Your Environment File
Edit `devconnect-backend/.env.local` and replace the placeholder values:

```env
# Cloudinary Configuration - REPLACE THESE:
CLOUDINARY_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_SECRET=your_actual_api_secret
```

### Step 4: Test the Configuration
Run the test script to verify everything works:

```bash
cd devconnect-backend
node test-cloudinary-setup.js
```

### Step 5: Restart Your Server
After updating the environment variables, restart your backend server:

```bash
npm run dev
```

## 📋 Example of Correct Configuration
Your `.env.local` should look something like this (with your actual values):

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster0.ffmfw9h.mongodb.net/devconnect?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5001
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration - ACTUAL VALUES HERE
CLOUDINARY_NAME=my-devconnect-app
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_SECRET=abcdefghijklmnopqrstuvwxyz123456

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## 🎯 What to Expect After Fix
- ✅ File uploads will work in profile setup
- ✅ Profile pictures will be stored in Cloudinary
- ✅ Resume uploads will function properly
- ✅ No more "Unknown API key" errors

## 🔍 Troubleshooting
1. **Double-check credentials**: Make sure you copy the exact values from Cloudinary dashboard
2. **Restart server**: Environment changes require server restart
3. **Check spelling**: Ensure variable names match exactly (CLOUDINARY_NAME, not CLOUDINARY_CLOUD_NAME)
4. **No quotes**: Don't put quotes around the values in .env file

## 📞 Need Help?
If you're still having issues:
1. Verify your Cloudinary account is active
2. Check that your API key hasn't expired
3. Ensure you're using the correct cloud name from your dashboard

The file upload system is already built and working - it just needs your actual Cloudinary credentials to function!
