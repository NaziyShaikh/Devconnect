import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function fixAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@devconnect.com' });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    // Hash the password and update
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    console.log('✅ Admin password fixed successfully!');
    console.log('Email: admin@devconnect.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixAdminPassword();
