import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

dotenv.config();

const createMissingProfiles = async () => {
  try {
    console.log('🔍 Checking for users without profiles...');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} total users`);

    // Find users who don't have profiles
    const usersWithProfiles = await Profile.find({}).select('user');
    const usersWithProfileIds = usersWithProfiles.map(p => p.user.toString());

    const usersWithoutProfiles = users.filter(user =>
      !usersWithProfileIds.includes(user._id.toString())
    );

    console.log(`❌ Found ${usersWithoutProfiles.length} users without profiles`);

    if (usersWithoutProfiles.length === 0) {
      console.log('✅ All users have profiles!');
      return;
    }

    // Create default profiles for users without profiles
    const profilesToCreate = usersWithoutProfiles.map(user => ({
      user: user._id,
      bio: `Hi, I'm ${user.name}! I'm a ${user.role || 'developer'} looking to collaborate on exciting projects.`,
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: 'Building amazing applications and collaborating with great teams.',
      github: '',
      portfolio: '',
      location: '',
      role: user.role || 'developer'
    }));

    console.log(`📝 Creating ${profilesToCreate.length} default profiles...`);

    const createdProfiles = await Profile.insertMany(profilesToCreate);

    console.log(`✅ Successfully created ${createdProfiles.length} profiles`);

    // Log the created profiles
    createdProfiles.forEach((profile, index) => {
      const user = usersWithoutProfiles[index];
      console.log(`   - Profile for ${user.name} (${user.email}): ${profile._id}`);
    });

  } catch (error) {
    console.error('❌ Error creating missing profiles:', error);
  }
};

export default createMissingProfiles;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const runScript = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB');

      await createMissingProfiles();

      console.log('🎉 Script completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Script failed:', error);
      process.exit(1);
    }
  };

  runScript();
}
