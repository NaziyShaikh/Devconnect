import express from 'express';
import { register, login, logout, getCurrentUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

console.log('🔐 Setting up auth routes...');
router.post('/register', register);
console.log('   ✅ POST /register route set up');
router.post('/login', login);
console.log('   ✅ POST /login route set up');
router.post('/logout', logout);
console.log('   ✅ POST /logout route set up');
router.get('/me', verifyToken, getCurrentUser);
console.log('   ✅ GET /me route set up');
router.post('/forgot-password', forgotPassword);
console.log('   ✅ POST /forgot-password route set up');
router.post('/reset-password', resetPassword);
console.log('   ✅ POST /reset-password route set up');

export default router;
