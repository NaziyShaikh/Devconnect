const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMessagesByRoom,
  sendMessage,
  getUserRooms
} = require('../controllers/messages');

// All message routes require authentication
router.use(protect);

// Get messages for a specific room
router.get('/room/:roomId', getMessagesByRoom);

// Send a message
router.post('/', sendMessage);

// Get all rooms for the authenticated user
router.get('/rooms', getUserRooms);

module.exports = router;
