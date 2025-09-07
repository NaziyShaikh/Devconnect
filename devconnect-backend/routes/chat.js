import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getMessagesWithUser } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:userId', verifyToken, getMessagesWithUser);

export default router;
