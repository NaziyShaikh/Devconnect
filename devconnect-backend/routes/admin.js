import express from 'express';
import {
  getAllUsers,
  blockUser,
  deleteUser,
  getAllProjects,
  deleteProject,
  reportContent,
  getReports
} from '../controllers/adminController.js';

import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Admin-only routes
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.put('/users/:id/block', verifyToken, isAdmin, blockUser);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

router.get('/projects', verifyToken, isAdmin, getAllProjects);
router.delete('/projects/:id', verifyToken, isAdmin, deleteProject);

router.post('/report', verifyToken, reportContent);
router.get('/reports', verifyToken, isAdmin, getReports);

export default router;
