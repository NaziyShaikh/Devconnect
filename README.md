backend - https://devconnect-backend-erja.onrender.com/

frontend - https://devconnect-frontend-tsk0.onrender.com/

 demo video 
 https://github.com/user-attachments/assets/cee4a023-a08f-4db5-a17d-c114d5f61528

 screenshots 
 
 

# DevConnect - Developer Collaboration Platform

A full-stack MERN application for developers to connect, collaborate, and build amazing projects together.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based registration and login with role management (developer/admin)
- **Developer Profiles**: Create and update profiles with skills, experience, GitHub/portfolio links
- **Project Collaboration**: Post project ideas, find collaborators, manage join requests
- **Real-time Chat**: Integrated chat system for team communication
- **Admin Panel**: Manage users, projects, and platform content
- **Search & Filter**: Find developers by skills and projects by requirements

### Bonus Features
- **Project Status Tracking**: Idea → In Progress → Completed workflow
- **Responsive Design**: Professional UI with Tailwind CSS
- **File Upload Support**: Resume and project image uploads (Cloudinary integration)

## 🛠 Tech Stack

### Frontend
- **React** (Create React App)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Socket.io-client** for real-time features

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time chat
- **Multer + Cloudinary** for file uploads

## 📁 Project Structure

```
devconnect/
├── client/                 # React Frontend (Create React App)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
├── server/                 # Node.js Backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd devconnect
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm start
   ```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Project Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/join` - Request to join project
- `PUT /api/projects/:id/respond` - Respond to join request

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users by skills

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@devconnect.com or join our Discord community.
