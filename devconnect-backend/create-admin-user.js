import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@devconnect.com' });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('Email: admin@devconnect.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@devconnect.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      role: 'admin',
      bio: 'Platform Administrator',
      skills: ['Management', 'System Administration'],
      location: 'System'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@devconnect.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdminUser();
