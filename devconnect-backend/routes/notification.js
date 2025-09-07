import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  getNotifications,
  markAllAsRead,
  markAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.patch('/read', verifyToken, markAllAsRead);
router.put('/:id/read', verifyToken, markAsRead);

export default router;
