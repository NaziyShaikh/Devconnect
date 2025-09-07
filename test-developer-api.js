const axios = require('axios');

// Test script to verify the API is working with developer users
const BASE_URL = 'http://localhost:5001/api';

async function testDeveloperAPI() {
  console.log('🧪 Testing Developer API');
  console.log('=' .repeat(40));

  try {
    // First, try to login as a developer to get authentication
    console.log('\n1. Attempting to login as developer...');

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    }, { withCredentials: true });

    console.log('✅ Login successful');
    const token = loginResponse.data.token;

    // Now test the users endpoint
    console.log('\n2. Testing GET /api/users endpoint...');

    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    console.log('✅ API call successful');
    console.log(`📊 Total users returned: ${usersResponse.data.length}`);

    // Analyze the response
    const developers = usersResponse.data.filter(u => u.role === 'developer');
    const admins = usersResponse.data.filter(u => u.role === 'admin');

    console.log(`👨‍💻 Developers: ${developers.length}`);
    console.log(`👑 Admins: ${admins.length}`);

    if (admins.length > 0) {
      console.log('\n✅ SUCCESS: Admin users are now being returned!');
      console.log('Admin users found:');
      admins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.name} (${admin.email})`);
      });
    } else {
      console.log('\n⚠️  No admin users found in API response');
      console.log('This could mean:');
      console.log('   - No admin users exist in the database');
      console.log('   - Admin users have incorrect role values');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);

    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }

    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running');
    console.log('2. Check if users exist in the database');
    console.log('3. Verify MongoDB connection is working');
    console.log('4. Check server logs for any errors');
  }
}

// Run the test
testDeveloperAPI().catch(console.error);
