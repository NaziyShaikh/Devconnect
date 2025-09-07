import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';
const timestamp = Date.now();
const testEmail = `profiletest${timestamp}@example.com`;

async function testProfileManagement() {
  console.log('🧪 Starting Profile Management Tests...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Profile Test User',
      email: testEmail,
      password: 'password123'
    });
    console.log('✅ Registration successful:', registerResponse.data.user.email);

    // Test 2: User Login
    console.log('\n2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    console.log('✅ Login successful, token received');

    // Test 3: Update Profile
    console.log('\n3. Testing Profile Update...');
    const profileData = {
      bio: 'Full-stack developer passionate about React and Node.js',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      experience: '3 years',
      github: 'https://github.com/profiletest',
      portfolio: 'https://profiletest.dev'
    };

    const updateResponse = await axios.put(`${BASE_URL}/users/update`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile updated successfully');

    // Test 4: Get Own Profile
    console.log('\n4. Testing Get Own Profile...');
    const getProfileResponse = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', getProfileResponse.data.name);
    console.log('   Bio:', getProfileResponse.data.bio);
    console.log('   Skills:', getProfileResponse.data.skills.join(', '));

    // Test 5: Search Developers by Skill
    console.log('\n5. Testing Search Developers by Skill...');
    const searchResponse = await axios.get(`${BASE_URL}/users/search/JavaScript`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Search successful, found', searchResponse.data.length, 'developers with JavaScript skill');

    // Test 6: List All Users (Admin functionality)
    console.log('\n6. Testing List All Users...');
    const listUsersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Users list retrieved, total users:', listUsersResponse.data.length);

    // Test 7: Update Profile Picture
    console.log('\n7. Testing Profile Picture Update...');
    const pictureResponse = await axios.put(`${BASE_URL}/users/update-picture`, {
      profilePicture: 'https://example.com/profile-pic.jpg'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile picture updated successfully');

    console.log('\n🎉 All Profile Management tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testProfileManagement();
