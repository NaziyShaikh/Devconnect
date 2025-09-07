import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';

dotenv.config();

async function checkNotifications() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all message notifications
    const messageNotifications = await Notification.find({ type: 'message' })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log('\n📋 Recent message notifications:');
    messageNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. User: ${notif.user?.name || 'Unknown'}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Created: ${notif.createdAt}`);
      console.log(`   Read: ${notif.isRead}`);
      console.log('   ---');
    });

    if (messageNotifications.length === 0) {
      console.log('No message notifications found');
    }

    // Count total notifications
    const totalCount = await Notification.countDocuments();
    const messageCount = await Notification.countDocuments({ type: 'message' });

    console.log(`\n📊 Total notifications: ${totalCount}`);
    console.log(`📊 Message notifications: ${messageCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkNotifications();
