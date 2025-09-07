import Message from '../models/Message.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

export const getMessagesWithUser = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort('createdAt');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ msg: 'Missing required fields: receiverId, text' });
    }

    // Use the authenticated user's ID as senderId for security
    const senderId = req.user.id;

    const message = new Message({
      senderId,
      receiverId,
      text
    });

    const savedMessage = await message.save();

    // Create notification for the receiver (only if not sending to self)
    if (senderId.toString() !== receiverId.toString()) {
      try {
        // Get sender's name for the notification message
        const sender = await User.findById(senderId).select('name');
        const receiver = await User.findById(receiverId).select('name');
        const notificationMessage = `${sender.name} sent you a message: "${text.length > 50 ? text.substring(0, 50) + '...' : text}"`;

        // Create notification for the receiver with correct sender and receiver info
        await createNotification(receiverId, 'message', notificationMessage);
        console.log(`Notification created for message: ${savedMessage._id} from ${sender.name} to ${receiver.name}`);
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Don't fail the message sending if notification creation fails
      }
    } else {
      console.log('Self-message: No notification created');
    }

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ msg: 'Failed to send message' });
  }
};
