import express from 'express';
import {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getProfileByUserId,
  deleteMyProfile
} from '../controllers/profileController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Create or update profile
router.post('/', verifyToken, createOrUpdateProfile);

// Get my profile
router.get('/me', verifyToken, getMyProfile);

// Get all profiles
router.get('/', verifyToken, getAllProfiles);

// Get profile by user ID
router.get('/:userId', verifyToken, getProfileByUserId);

// Delete my profile
router.delete('/', verifyToken, deleteMyProfile);

export default router;
