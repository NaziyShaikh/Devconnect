const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  bio: String,
  skills: [String],
  location: String
});

const User = mongoose.model('User', UserSchema);

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const allUsers = await User.find({});
    console.log('Total users in database:', allUsers.length);

    const developers = allUsers.filter(u => u.role === 'developer');
    const admins = allUsers.filter(u => u.role === 'admin');

    console.log('Developers:', developers.length);
    developers.forEach(dev => {
      console.log(`  - ${dev.name} (${dev.email}) - Role: ${dev.role}`);
    });

    console.log('Admins:', admins.length);
    admins.forEach(admin => {
      console.log(`  - ${admin.name} (${admin.email}) - Role: ${admin.role}`);
    });

    if (admins.length === 0) {
      console.log('\nNo admin users found. Creating a test admin...');

      const testAdmin = new User({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        bio: 'Test Administrator',
        skills: ['Management', 'Testing'],
        location: 'Test City'
      });

      await testAdmin.save();
      console.log('Test admin created successfully!');
      console.log('Email: admin@test.com');
      console.log('Password: admin123');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
