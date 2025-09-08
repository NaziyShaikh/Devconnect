import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/project.js';
import joinRequestsRoutes from './routes/joinRequests-updated.js';
import { setIoInstance as setJoinRequestsIoInstance } from './controllers/joinRequestsController-updated.js';
import { setIoInstance } from './controllers/projectController.js';
import { setIoInstance as setAuthIoInstance } from './controllers/authController.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notification.js';
import uploadRoutes from './routes/upload.js';
import localUploadRoutes from './routes/local-upload.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

// Enhanced startup logging
console.log('🚀 Starting DevConnect Backend Server...');
console.log('📋 Environment Variables Check:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   PORT: ${process.env.PORT || 5001}`);
console.log(`   CLIENT_URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ Missing'}`);

// Connect to database
try {
  connectDB();
  console.log('✅ Database connection established');
} catch (error) {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

const clientOrigin = process.env.CLIENT_URL || 'http://localhost:3000';

// Allow multiple origins for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://devconnect-1-l42o.onrender.com',
  'https://devconnect-oczl.onrender.com'
];

// CORS configuration function for Socket.IO
const corsOriginFunction = (origin, callback) => {
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);

  // Allow localhost for development
  if (origin.includes('localhost')) return callback(null, true);

  // Allow specific deployed domains
  if (allowedOrigins.includes(origin)) return callback(null, true);

  console.log('🚫 CORS rejected origin:', origin);
  return callback(new Error('Not allowed by CORS'));
};

const io = new Server(server, {
  cors: {
    origin: corsOriginFunction,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin', 'Authorization'],
  },
});

// Set io instance for project controller
setIoInstance(io);

// Set io instance for join requests controller
setJoinRequestsIoInstance(io);

// Set io instance for auth controller
setAuthIoInstance(io);

// CORS options for Express
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true);

    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);

    // Allow specific deployed domains
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Reject other origins
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

console.log('📋 Mounting API routes...');
app.use('/api/auth', authRoutes);
console.log('   ✅ Auth routes mounted at /api/auth');
app.use('/api/users', userRoutes);
console.log('   ✅ User routes mounted at /api/users');
app.use('/api/projects', projectRoutes);
console.log('   ✅ Project routes mounted at /api/projects');
app.use('/api/join-requests', joinRequestsRoutes);
console.log('   ✅ Join requests routes mounted at /api/join-requests');
app.use('/api/messages', messageRoutes);
console.log('   ✅ Message routes mounted at /api/messages');
app.use('/api/notifications', notificationRoutes);
console.log('   ✅ Notification routes mounted at /api/notifications');
app.use('/api/upload', uploadRoutes);
console.log('   ✅ Upload routes mounted at /api/upload');
app.use('/api/local-upload', localUploadRoutes);
console.log('   ✅ Local upload routes mounted at /api/local-upload');
app.use('/api/admin', adminRoutes);
console.log('   ✅ Admin routes mounted at /api/admin');

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Test route working' });
});

// Serve a simple welcome message at the root URL
app.get('/', (req, res) => {
  res.send('<h1>Welcome to DevConnect Backend Server</h1><p>The API is running.</p>');
});

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../devconnect-client-new/build')));

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ msg: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../devconnect-client-new/build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room ${userId}`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      console.log(`📤 Processing real-time message from ${senderId} to ${receiverId}`);

      // Import required models and functions
      const Message = (await import('./models/Message.js')).default;
      const User = (await import('./models/User.js')).default;
      const { createNotification } = await import('./controllers/notificationController.js');

      // Create and save the message to database
      const message = new Message({
        senderId,
        receiverId,
        text
      });

      const savedMessage = await message.save();
      console.log(`💾 Message saved to database: ${savedMessage._id}`);

      // Create notification for the receiver (only if not sending to self)
      if (senderId.toString() !== receiverId.toString()) {
        try {
          // Get sender's name for the notification message
          const sender = await User.findById(senderId).select('name');
          const notificationMessage = `${sender.name} sent you a message: "${text.length > 50 ? text.substring(0, 50) + '...' : text}"`;

          // Create notification for the receiver
          await createNotification(receiverId, 'message', notificationMessage);
          console.log(`🔔 Notification created for ${receiverId}`);
        } catch (notificationError) {
          console.error('❌ Failed to create notification:', notificationError);
        }
      }

      // Emit the complete message object to the receiver
      io.to(receiverId).emit('receiveMessage', {
        _id: savedMessage._id,
        senderId: savedMessage.senderId,
        receiverId: savedMessage.receiverId,
        text: savedMessage.text,
        createdAt: savedMessage.createdAt
      });

      console.log(`📨 Real-time message emitted to ${receiverId}`);

    } catch (error) {
      console.error('❌ Error processing real-time message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('🚪 A user disconnected:', socket.id);
  });

  // Handle notification events
  socket.on('notification', (data) => {
    console.log('🔔 Notification event received:', data);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
