# DevConnect Deployment Guide

## 🚀 Easy Frontend + Backend Deployment

This guide shows how to deploy both the frontend and backend together for simplified deployment.

### 📋 Prerequisites

- Node.js installed
- MongoDB database (local or cloud)
- Deployment platform (Render, Heroku, Railway, etc.)

### 🛠️ Build Scripts

The backend now includes scripts to handle frontend building:

```bash
# Install frontend dependencies
npm run install:frontend

# Build the frontend
npm run build:frontend

# Full deployment (install + build + start)
npm run deploy

# For Heroku deployment
npm run heroku-postbuild
```

### 🌐 Deployment Steps

#### Option 1: Single Server Deployment (Recommended)

1. **Build the frontend:**
   ```bash
   cd devconnect-backend
   npm run build:frontend
   ```

2. **Set environment variables:**
   ```bash
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=https://yourdomain.com
   ```

3. **Deploy the backend:**
   - The backend will automatically serve the built frontend files
   - All routes except `/api/*` will serve the React app
   - API routes work normally

#### Option 2: Separate Deployments

1. **Deploy backend separately:**
   ```bash
   cd devconnect-backend
   npm start
   ```

2. **Deploy frontend separately:**
   ```bash
   cd devconnect-client-new
   npm run build
   # Deploy the build folder to your frontend hosting service
   ```

### 🔧 Environment Variables

Create a `.env` file in the backend root:

```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 📦 File Structure After Build

```
devconnect-backend/
├── server.js
├── build/           # Frontend build files (created by build:frontend)
│   ├── index.html
│   ├── static/
│   └── ...
└── ...
```

### 🌍 Production URLs

- **Frontend:** `https://yourdomain.com/` (served by backend)
- **API:** `https://yourdomain.com/api/*`
- **WebSocket:** `wss://yourdomain.com/` (Socket.IO)

### 🚀 Quick Deploy Commands

```bash
# One-time setup
cd devconnect-backend
npm install
npm run install:frontend

# For deployment
npm run deploy
```

### 📝 Notes

- The backend serves the frontend from `/devconnect-client-new/build/`
- API routes are prefixed with `/api/`
- All other routes serve the React app (SPA routing)
- Socket.IO connections work automatically
- CORS is configured for the production domain

### 🐛 Troubleshooting

- **Build fails:** Make sure you have Node.js installed in the deployment environment
- **Static files not loading:** Check that the build folder exists and has correct permissions
- **API not working:** Verify environment variables are set correctly
- **WebSocket issues:** Ensure the deployment platform supports WebSocket connections
