const express = require('express');
const {
  getUsers,
  getUser,
  updateProfile,
  searchUsers
} = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/search', protect, searchUsers);
router.get('/:id', getUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
