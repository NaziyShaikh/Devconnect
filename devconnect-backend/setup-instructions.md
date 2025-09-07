# DevConnect Backend Setup Instructions

## 🚀 Quick Start Guide

### 1. Database Configuration
Your `.env` file needs the MongoDB connection string. Add this line to your `.env` file:

```
MONGO_URI=mongodb://localhost:27017/devconnect
```

### 2. Complete Environment Variables
Your `.env` file should contain:

```
# Database Configuration
MONGO_URI=mongodb://localhost:27017/devconnect

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration (Already Added)
CLOUDINARY_NAME=djg7rpdpi
CLOUDINARY_API_KEY=139924396781628
CLOUDINARY_SECRET=U2CsjQgshYRrymPoZ-shG5dzrms
```

### 3. Start the Backend Server

```bash
cd devconnect-backend
npm install
npm start
```

### 4. Verify Setup
Run the Cloudinary test:
```bash
node test-cloudinary-setup.js
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally on port 27017
- For MongoDB Atlas, use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devconnect`

### Port Already in Use
- Change PORT in `.env` file if 5000 is occupied

### Cloudinary Configuration
- The Cloudinary credentials are already properly configured
- Test with: `node test-cloudinary-setup.js`
