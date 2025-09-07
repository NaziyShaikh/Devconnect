import express from 'express';
import {
  sendMessage,
  getMessagesWithUser
} from '../controllers/chatController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Debug middleware for messages routes
router.use((req, res, next) => {
  console.log('📨 Messages Route Request:');
  console.log('   Method:', req.method);
  console.log('   Path:', req.path);
  console.log('   Full URL:', req.originalUrl);
  console.log('   Body:', req.body);
  console.log('   Headers:', req.headers);
  next();
});

router.post('/', verifyToken, sendMessage);
router.get('/:userId', verifyToken, getMessagesWithUser);

export default router;
