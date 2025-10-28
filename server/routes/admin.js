const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  blockUser,
  deleteUser,
  getAllProjects,
  deleteProject
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);
router.get('/projects', getAllProjects);
router.delete('/projects/:id', deleteProject);

module.exports = router;
