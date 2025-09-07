import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  requestJoin,
  respondToRequest,
  updateProject,
  updateProjectStatus
} from '../controllers/projectController.js';

import { verifyToken } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', verifyToken, upload.single('projectImage'), createProject);
router.get('/', verifyToken, getProjects);
router.get('/:id', verifyToken, getProject);
router.put('/:id', verifyToken, updateProject);
router.post('/:id/request', verifyToken, requestJoin);
router.patch('/:id/respond', verifyToken, respondToRequest);
router.patch('/:id/status', verifyToken, updateProjectStatus);

export default router;
