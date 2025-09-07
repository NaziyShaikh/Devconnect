const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testJoinRequests() {
  try {
    console.log('🧪 Testing Join Requests API...');

    // Test getting all join requests (admin endpoint)
    console.log('\n📋 Testing GET /join-requests/all...');
    const response = await axios.get(`${BASE_URL}/join-requests/all`, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE' // Replace with actual admin token
      }
    });

    console.log('✅ Successfully fetched join requests:', response.data.length, 'requests found');

    // Test accepting a request
    if (response.data.length > 0) {
      const requestId = response.data[0]._id;
      console.log('\n✅ Testing PUT /join-requests/:id/accept...');
      await axios.put(`${BASE_URL}/join-requests/${requestId}/accept`, {}, {
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE' // Replace with actual admin token
        }
      });
      console.log('✅ Successfully accepted join request');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testJoinRequests();
