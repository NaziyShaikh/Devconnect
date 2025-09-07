import express from 'express';
import {
  getAllJoinRequests,
  respondToJoinRequest,
  getAllJoinRequestsAdmin,
  respondToJoinRequestAdmin
} from '../controllers/joinRequestsController-updated.js';

import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllJoinRequests);
router.patch('/respond', verifyToken, respondToJoinRequest);

// Admin/Developer routes for managing all join requests
router.get('/all', verifyToken, getAllJoinRequestsAdmin);
router.put('/:requestId/:action', verifyToken, respondToJoinRequestAdmin);

export default router;
