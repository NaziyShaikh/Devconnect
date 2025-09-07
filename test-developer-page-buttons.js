// Test script to verify button behavior on developers page
console.log('🧪 Testing Developer Page Button Logic...\n');

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
console.log('\n📋 Current Button Logic Results:');

mockDevelopers.forEach(dev => {
  console.log(`\n👨‍💻 Developer: ${dev.name} (${dev._id})`);

  // Current logic from the code
  const shouldShowChat = mockUser && mockUser._id && dev._id && mockUser._id !== dev._id;
  const shouldShowOwnProfile = mockUser && mockUser._id && dev._id && mockUser._id === dev._id;
  const shouldShowNothing = !mockUser || !mockUser._id;

  if (shouldShowChat) {
    console.log('   ✅ Shows: Chat Button (green)');
  } else if (shouldShowOwnProfile) {
    console.log('   ✅ Shows: Your Profile Button (gray, disabled)');
  } else if (shouldShowNothing) {
    console.log('   ✅ Shows: Nothing (user not logged in)');
  }

  // What the user might want
  if (dev._id === mockUser._id) {
    console.log('   💡 User might want: Some messaging functionality for own profile?');
  }
});

console.log('\n🎯 Current Behavior Summary:');
console.log('✅ Other developers: Show "Chat" button');
console.log('✅ Own profile: Show "Your Profile" button (disabled)');
console.log('✅ Not logged in: Show no buttons');

console.log('\n❓ Question for User:');
console.log('Do you want the logged-in user to see a messaging/chat button');
console.log('even for their own profile on the developers page?');

console.log('\n🔧 If you want to change this behavior, we can modify the logic to:');
console.log('1. Show "Chat" button for own profile too');
console.log('2. Show different messaging functionality');
console.log('3. Keep current behavior (recommended UX)');

console.log('\n✨ Test completed - awaiting your clarification!');
