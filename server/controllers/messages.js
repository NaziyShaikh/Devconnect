const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Get messages for a specific room
const getMessagesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { roomId, message, messageType = 'text', fileUrl } = req.body;
    const sender = req.user.id;

    const newMessage = new Message({
      roomId,
      sender,
      message,
      messageType,
      fileUrl
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email');

    // Create notifications for all room participants except sender
    try {
      // Get sender's name for notification
      const senderUser = await User.findById(sender).select('name');

      let recipients = [];

      // For direct messages, roomId is typically "user1-user2"
      if (roomId.includes('-')) {
        const roomParticipants = roomId.split('-');
        recipients = roomParticipants.filter(id => id !== sender.toString());
      } else {
        // For group chats or other room types, find all users who have sent messages in this room
        const participants = await Message.distinct('sender', { roomId });
        recipients = participants.filter(participantId => participantId.toString() !== sender.toString());
      }

      // Create notifications for each recipient
      const notificationPromises = recipients.map(recipientId =>
        Notification.create({
          recipient: recipientId,
          type: 'general',
          title: 'New Message',
          message: `${senderUser.name} sent a message in your chat`,
          relatedId: roomId,
          relatedModel: 'Message'
        })
      );

      await Promise.all(notificationPromises);
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Don't fail the message send if notifications fail
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Get all rooms for a user (rooms where user has messages)
const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await Message.distinct('roomId', {
      $or: [
        { sender: userId },
        // For user-to-user chats, roomId is typically sorted user IDs
      ]
    });

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
};

module.exports = {
  getMessagesByRoom,
  sendMessage,
  getUserRooms
};
