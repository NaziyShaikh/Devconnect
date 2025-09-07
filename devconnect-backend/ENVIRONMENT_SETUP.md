# Environment Configuration Setup

## Complete Environment Variables Configuration

Create a `.env` file in the `devconnect-backend` directory with the following content:

```bash
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://naziyahm3:OAfZb310rTiP2QsK@cluster0.ffmfw9h.mongodb.net/devconnect?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5001
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration (Complete)
CLOUDINARY_NAME=Root
CLOUDINARY_API_KEY=139924396781628
CLOUDINARY_SECRET=U2CsjQgshYRrymPoZ-shG5dzrms
CLOUDINARY_URL=cloudinary://139924396781628:U2CsjQgshYRrymPoZ-shG5dzrms@djg7rpdpi

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

## Cloudinary Configuration Details
- **Cloud Name**: djg7rpdpi
- **API Key**: 139924396781628
- **API Secret**: U2CsjQgshYRrymPoZ-shG5dzrms
- **Full URL**: cloudinary://139924396781628:U2CsjQgshYRrymPoZ-shG5dzrms@djg7rpdpi

## Setup Instructions
1. Copy the above configuration into your `.env` file
2. Replace `your_jwt_secret_key_here` with a secure JWT secret
3. Start the application with `npm start`

## Verification
- MongoDB Atlas connection will be tested automatically on startup
- Cloudinary configuration will be validated during image upload operations
