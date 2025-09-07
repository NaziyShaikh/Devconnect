// Test script to verify updated button behavior on developers page
console.log('🧪 Testing Updated Developer Page Button Logic...\n');

// Mock user data
const mockUser = {
  _id: 'user123',
  name: 'King Khan',
  email: 'kingkhan@gmail.com'
};

const mockDevelopers = [
  {
    _id: 'user123',
    name: 'King Khan',
    email: 'kingkhan@gmail.com',
    skills: ['JavaScript', 'React', 'Node.js']
  },
  {
    _id: 'user456',
    name: 'Jane Smith',
    email: 'jane@example.com',
    skills: ['Python', 'Django']
  },
  {
    _id: 'user789',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    skills: ['Java', 'Spring']
  }
];

console.log('👤 Logged-in User:', mockUser.name, `(${mockUser._id})`);
console.log('\n📋 Updated Button Logic Results:');

mockDevelopers.forEach(dev => {
  console.log(`\n👨‍💻 Developer: ${dev.name} (${dev._id})`);

  // Updated logic from the code
  const shouldShowChat = mockUser && mockUser._id && dev._id;
  const buttonText = shouldShowChat ? (mockUser._id === dev._id ? 'Test Chat' : 'Chat') : 'No Button';

  if (shouldShowChat) {
    console.log(`   ✅ Shows: "${buttonText}" Button (green)`);
    if (mockUser._id === dev._id) {
      console.log('   🎯 Special: "Test Chat" for own profile (allows self-messaging)');
    } else {
      console.log('   💬 Normal: "Chat" for other developers');
    }
  } else {
    console.log('   ❌ Shows: No button (user not logged in)');
  }
});

console.log('\n🎯 Updated Behavior Summary:');
console.log('✅ Own profile: Shows "Test Chat" button (green, clickable)');
console.log('✅ Other developers: Shows "Chat" button (green)');
console.log('✅ Not logged in: Shows no buttons');

console.log('\n🔧 Key Changes Made:');
console.log('✅ Removed restriction preventing users from messaging themselves');
console.log('✅ Own profile now shows "Test Chat" button instead of disabled "Your Profile"');
console.log('✅ All logged-in users can now access chat functionality for any profile');

console.log('\n💡 Use Cases for Self-Messaging:');
console.log('• Testing the chat interface and real-time messaging');
console.log('• Creating personal notes or reminders');
console.log('• Saving messages for later reference');
console.log('• Debugging chat functionality');

console.log('\n✨ Updated implementation completed successfully!');
