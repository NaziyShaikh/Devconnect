const axios = require('axios');

// Test script to verify admin users are now returned by the API
const BASE_URL = 'http://localhost:5001/api';

async function testAdminAPI() {
  console.log('🧪 Testing Admin API Fix');
  console.log('=' .repeat(40));

  try {
    // First, try to login as admin to get authentication
    console.log('\n1. Attempting to login as admin...');

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
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
      console.log('\n❌ ISSUE: No admin users found in API response');
      console.log('This could mean:');
      console.log('   - No admin users exist in the database');
      console.log('   - Admin users have incorrect role values');
      console.log('   - API is still filtering out admins');
    }

    // Test with different admin credentials if first one fails
    if (admins.length === 0) {
      console.log('\n3. Testing with alternative admin credentials...');

      try {
        const altLogin = await axios.post(`${BASE_URL}/auth/login`, {
          email: 'admin@test.com',
          password: 'admin123'
        }, { withCredentials: true });

        const altToken = altLogin.data.token;
        const altUsersResponse = await axios.get(`${BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${altToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        const altAdmins = altUsersResponse.data.filter(u => u.role === 'admin');
        console.log(`Alternative admin test - Admins found: ${altAdmins.length}`);

        if (altAdmins.length > 0) {
          console.log('✅ Alternative admin credentials work!');
        }
      } catch (altError) {
        console.log('❌ Alternative admin credentials also failed');
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);

    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }

    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running');
    console.log('2. Check if admin users exist in the database');
    console.log('3. Verify MongoDB connection is working');
    console.log('4. Check server logs for any errors');
  }
}

// Run the test
testAdminAPI().catch(console.error);
