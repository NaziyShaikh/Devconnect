import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';
import Message from './models/Message.js';

dotenv.config();

async function testNotificationIssue() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const allUsers = await User.find({}).select('name email');
    console.log('\n👥 All users in system:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ID: ${user._id}`);
    });

    // Find user with most notifications
    const notificationStats = await Notification.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    console.log('\n📊 Users with most notifications:');
    for (const stat of notificationStats) {
      const user = await User.findById(stat._id);
      console.log(`- ${user.name}: ${stat.count} notifications`);
    }

    // Check recent notifications
    const recentNotifications = await Notification.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log('\n🔔 Recent notifications:');
    recentNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.user?.name || 'Unknown'}] ${notif.message}`);
      console.log(`   Type: ${notif.type}, Read: ${notif.isRead}, Created: ${notif.createdAt}`);
    });

    // Check for self-messages
    console.log('\n🔍 Checking for self-messages...');
    const selfMessages = await Message.find({
      $expr: { $eq: ['$senderId', '$receiverId'] }
    }).populate('senderId', 'name').limit(5);

    if (selfMessages.length > 0) {
      console.log('Found self-messages:');
      selfMessages.forEach(msg => {
        console.log(`- ${msg.senderId.name} sent to himself: "${msg.text}"`);
      });
    } else {
      console.log('No self-messages found');
    }

    console.log('\n💡 Analysis:');
    console.log('1. Check the recent notifications above for incorrect sender names');
    console.log('2. Self-messages should not create notifications');
    console.log('3. If you see wrong names, those might be old notifications from before the fix');
    console.log('4. The current code prevents notifications for self-messages');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testNotificationIssue();
