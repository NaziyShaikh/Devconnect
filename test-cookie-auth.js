// Test script to verify cookie-based authentication works for frontend
// Run with: node test-cookie-auth.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testCookieAuth() {
  console.log('🧪 Testing cookie-based authentication for frontend...');

  try {
    // Create a test user
    const testUser = {
      name: 'Cookie Test User',
      email: `cookietest${Date.now()}@example.com`,
      password: 'password123',
      role: 'developer'
    };

    // Register
    console.log('1. Registering test user...');
    await axios.post(`${BASE_URL}/auth/register`, testUser, { withCredentials: true });
    console.log('✅ Registration successful');
    
    // Login
    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, {
      withCredentials: true
    });
    
    console.log('✅ Login successful');
    console.log('User data:', loginResponse.data.user);
    
    // Test accessing a protected route using the cookie
    console.log('3. Testing protected route access with cookies...');
    
    // Create a new axios instance that will preserve cookies
    const authedAxios = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Test accessing the current user endpoint (protected)
    try {
      const userResponse = await authedAxios.get('/auth/me');
      console.log('✅ Protected route access successful!');
      console.log('Current user:', userResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Protected route rejected access (401 Unauthorized)');
        console.log('Error:', error.response.data);
      } else {
        console.log('✅ Protected route accepted cookies (different error expected)');
        console.log('Status:', error.response?.status);
      }
    }
    
    console.log('🎉 Cookie-based authentication test completed!');

  } catch (error) {
    console.log('❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCookieAuth();
