import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'developer' },
  bio: String,
  skills: [String],
  location: String,
  profilePicture: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb+srv://naziyahm3:OAfZb310rTiP2QsK@cluster0.ffmfw9h.mongodb.net/devconnect?retryWrites=true&w=majority&appName=Cluster0');

    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@devconnect.com' });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('Email: admin@devconnect.com');
      console.log('Password: admin123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@devconnect.com',
      password: hashedPassword,
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
