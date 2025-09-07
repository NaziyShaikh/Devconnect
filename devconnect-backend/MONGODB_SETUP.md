# MongoDB Connection Setup Guide

## Quick Fix Steps

### 1. Check Your .env File
Create or update your `.env` file in the `devconnect-backend` folder with:

```bash
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/devconnect

# Other required variables
CLIENT_URL=http://localhost:3000
PORT=5001

# Cloudinary (if using)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_secret
```

### 2. Verify MongoDB is Running
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (if not running)
# On Windows:
net start MongoDB

# On macOS/Linux:
sudo systemctl start mongod
```

### 3. Test the Connection
```bash
# Navigate to backend directory
cd devconnect-backend

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

### 4. Expected Output
When the server starts successfully, you should see:
```
🔍 Attempting to connect to MongoDB...
✅ MongoDB Connected Successfully!
📊 Database: devconnect
🔗 Host: localhost
📍 Port: 27017
🚀 Server running on port 5001
```

## Troubleshooting

### Common Issues and Solutions

1. **"MONGO_URI is not defined"**
   - Add `MONGO_URI` to your `.env` file
   - Restart the server after adding

2. **"MongoDB connection failed"**
   - Ensure MongoDB service is running
   - Check if the connection string is correct
   - Verify MongoDB is listening on port 27017

3. **"Network Error" in browser**
   - Ensure backend server is running on port 5001
   - Check if CORS is properly configured
   - Verify CLIENT_URL in .env matches your frontend URL

### MongoDB Connection Strings

**Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/devconnect
```

**MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devconnect?retryWrites=true&w=majority
```

**With Authentication:**
```
MONGO_URI=mongodb://username:password@localhost:27017/devconnect?authSource=admin
```

### Testing MongoDB Connection

You can test the connection manually:
```bash
# Test MongoDB connection
mongo mongodb://localhost:27017/devconnect

# Check if database exists
show dbs
```

### Development Commands

```bash
# Start MongoDB service
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Start backend server
cd devconnect-backend
npm start

# Start frontend (in another terminal)
cd devconnect-client-new
npm start
