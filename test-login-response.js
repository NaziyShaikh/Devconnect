// Test script to check login response format
// Run with: node test-login-response.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testLoginResponse() {
  console.log('🧪 Testing login response format...');

  try {
    // Create a test user
    const testUser = {
      name: 'Test User Response',
      email: `testresponse${Date.now()}@example.com`,
      password: 'password123',
      role: 'developer'
    };

    // Register
    console.log('1. Registering test user...');
    await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful');
    
    // Login
    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, {
      withCredentials: true // Important to receive cookies
    });
    
    console.log('✅ Login successful');
    console.log('Response data:', loginResponse.data);
    console.log('Response headers:', loginResponse.headers);
    console.log('Cookies in response:', loginResponse.headers['set-cookie']);
    
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

testLoginResponse();
