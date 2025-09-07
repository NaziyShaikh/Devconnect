import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api/auth';
const timestamp = Date.now();
const testEmail = `testuser${timestamp}@example.com`;

async function testAuth() {
  console.log('🧪 Starting Authentication & Authorization Tests...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      name: 'Test User',
      email: testEmail,
      password: 'password123'
    });
    console.log('✅ Registration successful:', registerResponse.data.user.email);

    // Test 2: User Login
    console.log('\n2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testEmail,
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');

    // Test 3: Get Current User
    console.log('\n3. Testing Get Current User...');
    const userResponse = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Current user retrieved:', userResponse.data.email);

    // Test 4: Forgot Password
    console.log('\n4. Testing Forgot Password...');
    const forgotResponse = await axios.post(`${BASE_URL}/forgot-password`, {
      email: testEmail
    });
    console.log('✅ Forgot password request handled:', forgotResponse.data.msg);

    // Test 5: Admin Login
    console.log('\n5. Testing Admin Login...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@devconnect.com',
      password: 'admin123'
    });
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');

    // Test 6: Admin Access to Admin Endpoints
    console.log('\n6. Testing Admin Access to Admin Endpoints...');
    const adminUsersResponse = await axios.get('http://localhost:5001/api/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin can access admin endpoints, users count:', adminUsersResponse.data.length);

    // Test 7: Developer Access Denied to Admin Endpoints
    console.log('\n7. Testing Developer Access Denied to Admin Endpoints...');
    try {
      await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('❌ Developer should not access admin endpoints');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Developer correctly denied access to admin endpoints');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 8: Logout
    console.log('\n8. Testing Logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/logout`);
    console.log('✅ Logout successful');

    console.log('\n🎉 All Authentication & Authorization tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAuth();
