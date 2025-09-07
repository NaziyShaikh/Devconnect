const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  modifyUser,
  getAllProjects,
  deleteProject
} = require('../controllers/adminController');

router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.post('/users/:id', modifyUser);

router.get('/projects', getAllProjects);
router.delete('/projects/:id', deleteProject);

module.exports = router;
