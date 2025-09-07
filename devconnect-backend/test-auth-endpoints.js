import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

console.log('🔍 Testing Authentication Endpoints...\n');

// Test 1: Login
async function testLogin() {
  try {
    console.log('1. Testing Login...');
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    }, {
      withCredentials: true
    });

    console.log('✅ Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Get Current User (with cookie)
async function testGetCurrentUser() {
  try {
    console.log('\n2. Testing Get Current User...');
    const response = await axios.get(`${API_BASE}/auth/me`, {
      withCredentials: true
    });

    console.log('✅ Get Current User successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Get Current User failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Get Notifications (with cookie)
async function testGetNotifications() {
  try {
    console.log('\n3. Testing Get Notifications...');
    const response = await axios.get(`${API_BASE}/notifications`, {
      withCredentials: true
    });

    console.log('✅ Get Notifications successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Get Notifications failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Logout
async function testLogout() {
  try {
    console.log('\n4. Testing Logout...');
    const response = await axios.post(`${API_BASE}/auth/logout`, {}, {
      withCredentials: true
    });

    console.log('✅ Logout successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Logout failed:', error.response?.data || error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  const loginResult = await testLogin();
  if (loginResult) {
    await testGetCurrentUser();
    await testGetNotifications();
    await testLogout();
  }

  console.log('\n🎯 Authentication testing completed!');
}

runTests().catch(console.error);
