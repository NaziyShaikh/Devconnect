import express from 'express';
import {
  getAllJoinRequests,
  respondToJoinRequest
} from '../controllers/joinRequestsController.js';

import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllJoinRequests);
router.patch('/respond', verifyToken, respondToJoinRequest);

export default router;
