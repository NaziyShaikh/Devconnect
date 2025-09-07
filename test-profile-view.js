// Test script to verify profile viewing functionality
// Run with: node test-profile-view.js

const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// Create axios instance with cookie jar support
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const BASE_URL = 'http://localhost:5001/api';

async function testProfileView() {
  console.log('🧪 Testing profile viewing functionality...');

  try {
    // Create a test user
    const testUser = {
      name: 'Profile Test User',
      email: `profiletest${Date.now()}@example.com`,
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
    const userId = loginResponse.data.user.id;
    console.log('User ID:', userId);
    
    // Test accessing the user's own profile
    console.log('3. Testing own profile access...');
    try {
      const ownProfileResponse = await client.get(`${BASE_URL}/users/${userId}`, {
        withCredentials: true
      });
      console.log('✅ Own profile access successful!');
      console.log('Profile data:', {
        name: ownProfileResponse.data.name,
        email: ownProfileResponse.data.email,
        skills: ownProfileResponse.data.skills,
        bio: ownProfileResponse.data.bio
      });
    } catch (error) {
      console.log('❌ Own profile access failed');
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Test accessing the users list (to see all developers)
    console.log('4. Testing developers list access...');
    try {
      const developersResponse = await client.get(`${BASE_URL}/users`, {
        withCredentials: true
      });
      console.log('✅ Developers list access successful!');
      console.log('Number of developers:', developersResponse.data.length);
      
      if (developersResponse.data.length > 0) {
        const firstDeveloper = developersResponse.data[0];
        console.log('First developer:', {
          id: firstDeveloper._id,
          name: firstDeveloper.name,
          email: firstDeveloper.email
        });
        
        // Test viewing another developer's profile
        console.log('5. Testing another developer profile access...');
        try {
          const otherProfileResponse = await client.get(`${BASE_URL}/users/${firstDeveloper._id}`, {
            withCredentials: true
          });
          console.log('✅ Other profile access successful!');
          console.log('Other profile:', {
            name: otherProfileResponse.data.name,
            email: otherProfileResponse.data.email
          });
        } catch (error) {
          console.log('❌ Other profile access failed');
          console.log('Error:', error.response?.data || error.message);
        }
      }
    } catch (error) {
      console.log('❌ Developers list access failed');
      console.log('Error:', error.response?.data || error.message);
    }
    
    console.log('🎉 Profile viewing test completed!');

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

testProfileView();
