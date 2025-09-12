import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Profile from './models/Profile.js';

dotenv.config();

const testProfileCreation = async () => {
  try {
    console.log('🔍 Testing profile creation...');

    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} total users`);

    // Check each user for profile
    for (const user of users) {
      console.log(`\n👤 Checking user: ${user.name} (${user.email})`);
      console.log(`   User ID: ${user._id}`);

      const profile = await Profile.findOne({ user: user._id });
      if (profile) {
        console.log(`   ✅ Profile exists: ${profile._id}`);
        console.log(`   Bio: ${profile.bio || 'No bio'}`);
        console.log(`   Skills: ${profile.skills?.length || 0} skills`);
      } else {
        console.log(`   ❌ No profile found`);

        // Create a default profile
        console.log(`   📝 Creating default profile...`);
        const newProfile = new Profile({
          user: user._id,
          bio: `Hi, I'm ${user.name}! I'm a ${user.role || 'developer'} looking to collaborate on exciting projects.`,
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: 'Building amazing applications and collaborating with great teams.',
          github: '',
          portfolio: '',
          location: '',
          role: user.role || 'developer'
        });

        await newProfile.save();
        console.log(`   ✅ Created profile: ${newProfile._id}`);
      }
    }

    console.log('\n🎉 Profile creation test completed');

  } catch (error) {
    console.error('❌ Error during profile creation test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testProfileCreation();
}

export default testProfileCreation;
