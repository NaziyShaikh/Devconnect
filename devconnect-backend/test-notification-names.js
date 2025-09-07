import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';
import Message from './models/Message.js';

dotenv.config();

async function testNotificationNames() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('name email _id');
    console.log('\n👥 Users in system:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ID: ${user._id}`);
    });

    // Test: Create a message between two different users
    if (users.length >= 2) {
      const sender = users[0];
      const receiver = users[1];

      console.log(`\n📤 Testing message from ${sender.name} to ${receiver.name}...`);

      // Create a test message
      const testMessage = new Message({
        senderId: sender._id,
        receiverId: receiver._id,
        text: 'Test message for notification verification'
      });

      const savedMessage = await testMessage.save();
      console.log('✅ Test message created:', savedMessage._id);

      // Manually create notification (simulating what happens in chatController)
      const notificationMessage = `${sender.name} sent you a message: "${testMessage.text}"`;
      await Notification.create({
        user: receiver._id,
        type: 'message',
        message: notificationMessage
      });

      console.log('✅ Notification created for receiver');

      // Check the notification
      const recentNotifications = await Notification.find({ user: receiver._id })
        .sort({ createdAt: -1 })
        .limit(1);

      console.log('\n🔔 Latest notification for receiver:');
      recentNotifications.forEach(notif => {
        console.log(`Message: ${notif.message}`);
        console.log(`Type: ${notif.type}, Read: ${notif.isRead}`);
      });

      // Clean up test data
      await Message.findByIdAndDelete(savedMessage._id);
      await Notification.findOneAndDelete({ user: receiver._id, message: notificationMessage });
      console.log('🧹 Test data cleaned up');
    }

    // Check existing notifications for any wrong names
    console.log('\n🔍 Checking existing notifications for issues...');
    const allNotifications = await Notification.find({ type: 'message' })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log('Recent message notifications:');
    allNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.user?.name || 'Unknown'}] ${notif.message}`);
    });

    console.log('\n💡 Analysis:');
    console.log('1. Notifications should show the SENDER name, not receiver name');
    console.log('2. Format should be: "SenderName sent you a message: ..."');
    console.log('3. Self-messages should not create notifications');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testNotificationNames();
