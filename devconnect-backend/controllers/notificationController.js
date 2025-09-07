import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch notifications' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update notification' });
  }
};

export const createNotification = async (userId, type, message, io) => {
  try {
    let notifications = [];

    if (userId === null) {
      // Broadcast to all users - get all user IDs
      const User = (await import('../models/User.js')).default;
      const allUsers = await User.find({}, '_id');
      const userIds = allUsers.map(user => user._id);

      // Create notifications for all users
      const notificationPromises = userIds.map(id =>
        Notification.create({ user: id, type, message })
      );
      notifications = await Promise.all(notificationPromises);

      // Emit real-time notifications to all users
      if (io) {
        notifications.forEach(notification => {
          io.to(notification.user.toString()).emit('notification', notification);
        });
        console.log(`🔔 Real-time notification broadcasted to ${userIds.length} users`);
      }
    } else {
      // Single user notification
      const notification = await Notification.create({ user: userId, type, message });
      notifications = [notification];

      // Emit real-time notification if io is available
      if (io) {
        io.to(userId).emit('notification', notification);
        console.log(`🔔 Real-time notification emitted to user ${userId}`);
      }
    }

    return notifications;
  } catch (err) {
    console.error('Notification error:', err.message);
    return null;
  }
};
