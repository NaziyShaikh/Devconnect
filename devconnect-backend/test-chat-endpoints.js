import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

console.log('🗨️  Testing Chat Endpoints...\n');

// Test 0: Register and Login to get token
async function registerAndLogin() {
  try {
    console.log('0. Registering test users...');

    // Register first user
    const timestamp = Date.now();
    await axios.post(`${API_BASE}/auth/register`, {
      name: 'Chat User 1',
      email: `chat-user1-${timestamp}@example.com`,
      password: 'password123'
    }, {
      withCredentials: true
    });

    // Register second user
    await axios.post(`${API_BASE}/auth/register`, {
      name: 'Chat User 2',
      email: `chat-user2-${timestamp}@example.com`,
      password: 'password123'
    }, {
      withCredentials: true
    });

    console.log('1. Logging in as User 1...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: `chat-user1-${timestamp}@example.com`,
      password: 'password123'
    }, {
      withCredentials: true
    });

    console.log('✅ Login successful');
    return loginResponse.data.token;
  } catch (error) {
    console.log('❌ Auth failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 1: Get current user info
async function getCurrentUser(token) {
  try {
    console.log('\n2. Getting current user info...');
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });

    console.log('✅ Current user:', response.data.name, '(ID:', response.data._id, ')');
    return response.data;
  } catch (error) {
    console.log('❌ Get current user failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Get all users to find another user to chat with
async function getUsers(token) {
  try {
    console.log('\n3. Getting users list...');
    const response = await axios.get(`${API_BASE}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });

    console.log('✅ Found', response.data.length, 'users');
    return response.data;
  } catch (error) {
    console.log('❌ Get users failed:', error.response?.data || error.message);
    return [];
  }
}

// Test 3: Send a message
async function sendMessage(token, senderId, receiverId) {
  try {
    console.log('\n4. Sending message...');
    const messageData = {
      receiverId: receiverId,
      text: 'Hello from automated test! 👋'
    };

    const response = await axios.post(`${API_BASE}/messages`, messageData, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });

    console.log('✅ Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Send message failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Get messages with user
async function getMessages(token, userId) {
  try {
    console.log('\n5. Getting message history...');
    const response = await axios.get(`${API_BASE}/messages/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });

    console.log('✅ Retrieved', response.data.length, 'messages');
    if (response.data.length > 0) {
      console.log('Latest message:', response.data[response.data.length - 1].text);
    }
    return response.data;
  } catch (error) {
    console.log('❌ Get messages failed:', error.response?.data || error.message);
    return [];
  }
}

// Test 5: Test without authentication
async function testWithoutAuth() {
  try {
    console.log('\n6. Testing message send without authentication...');
    const response = await axios.post(`${API_BASE}/messages`, {
      sender: 'fake-id',
      recipient: 'another-fake-id',
      content: 'This should fail'
    });

    console.log('❌ Should have failed but succeeded:', response.data);
    return response.data;
  } catch (error) {
    console.log('✅ Correctly failed without auth:', error.response?.data || error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  const token = await registerAndLogin();
  if (token) {
    const currentUser = await getCurrentUser(token);
    if (currentUser) {
      const users = await getUsers(token);
      if (users.length > 1) {
        // Find another user (not the current user)
        const otherUser = users.find(u => u._id !== currentUser._id);
        if (otherUser) {
          console.log('📨 Chatting with:', otherUser.name);
          await sendMessage(token, currentUser._id, otherUser._id);
          await getMessages(token, otherUser._id);
        }
      }
    }
    await testWithoutAuth();
  }

  console.log('\n🎯 Chat testing completed!');
}

runTests().catch(console.error);
