import express from 'express';
import {
  updateProfile,
  getProfile,
  listDevelopers,
  searchDevelopers,
  updateProfilePicture,
  listAllUsers
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:id', verifyToken, getProfile);
router.put('/update', verifyToken, updateProfile);
router.put('/update-picture', verifyToken, updateProfilePicture);
router.get('/', verifyToken, listAllUsers);
router.get('/search/:skill', verifyToken, searchDevelopers);

export default router;
