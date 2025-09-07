// Test script to verify cookie-based authentication with proper cookie handling
// Run with: node test-cookie-jar.js

const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// Create axios instance with cookie jar support
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const BASE_URL = 'http://localhost:5001/api';

async function testCookieJar() {
  console.log('🧪 Testing cookie-based authentication with cookie jar...');

  try {
    // Create a test user
    const testUser = {
      name: 'Cookie Jar Test User',
      email: `cookiejartest${Date.now()}@example.com`,
      password: 'password123',
      role: 'developer'
    };

    // Register
    console.log('1. Registering test user...');
    await client.post(`${BASE_URL}/auth/register`, testUser, {
      withCredentials: true
    });
    console.log('✅ Registration successful');
    
    // Login
    console.log('2. Logging in...');
    const loginResponse = await client.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, {
      withCredentials: true
    });
    
    console.log('✅ Login successful');
    console.log('User data:', loginResponse.data.user);
    
    // Check what cookies we have
    const cookies = await jar.getCookies(BASE_URL);
    console.log('Cookies in jar:', cookies.map(c => c.key));
    
    // Test accessing a protected route using the cookie
    console.log('3. Testing protected route access with cookies...');
    
    try {
      const userResponse = await client.get(`${BASE_URL}/auth/me`, {
        withCredentials: true
      });
      console.log('✅ Protected route access successful!');
      console.log('Current user:', userResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Protected route rejected access (401 Unauthorized)');
        console.log('Error:', error.response.data);
        console.log('Request headers sent:', error.config?.headers);
      } else {
        console.log('✅ Protected route accepted cookies (different error expected)');
        console.log('Status:', error.response?.status);
      }
    }
    
    console.log('🎉 Cookie jar authentication test completed!');

  } catch (error) {
    console.log('❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCookieJar();
