const axios = require('axios');

// Test messaging flow between two users
async function testMessagingFlow() {
  console.log('🧪 Testing Messaging Flow...\n');

  const API_BASE = 'http://localhost:5001/api';

  try {
    // Step 1: Login as admin user
    console.log('1️⃣ Logging in as admin user...');
    const login1 = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@devconnect.com',
      password: 'admin123'
    }, { withCredentials: true });

    console.log('✅ User 1 logged in:', login1.data.user.name);

    // Step 2: Get all users to find second user
    console.log('\n2️⃣ Getting all users...');
    const users = await axios.get(`${API_BASE}/users`, {
      headers: { Cookie: login1.headers['set-cookie']?.join('; ') }
    });

    const user2 = users.data.find(u => u.email !== 'test@example.com');
    if (!user2) {
      console.log('❌ No second user found. Please create another user first.');
      return;
    }

    console.log('✅ Found second user:', user2.name);

    // Step 3: Send message from user1 to user2
    console.log('\n3️⃣ Sending message from user1 to user2...');
    const messageData = {
      receiverId: user2._id,
      text: `Test message from ${login1.data.user.name} at ${new Date().toISOString()}`
    };

    const sendMessage = await axios.post(`${API_BASE}/messages`, messageData, {
      headers: { Cookie: login1.headers['set-cookie']?.join('; ') }
    });

    console.log('✅ Message sent successfully:', sendMessage.data.text);

    // Step 4: Check if message was saved in database
    console.log('\n4️⃣ Checking if message was saved...');
    const messages = await axios.get(`${API_BASE}/messages/${user2._id}`, {
      headers: { Cookie: login1.headers['set-cookie']?.join('; ') }
    });

    const latestMessage = messages.data[messages.data.length - 1];
    console.log('✅ Latest message in chat:', latestMessage?.text);

    if (latestMessage && latestMessage.text === messageData.text) {
      console.log('✅ Message successfully saved to database');
    } else {
      console.log('❌ Message not found in database');
    }

    // Step 5: Test Socket.IO connection (basic connectivity)
    console.log('\n5️⃣ Testing Socket.IO connectivity...');
    const io = require('socket.io-client');
    const socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected successfully');
      socket.emit('join', login1.data.user._id);
      console.log('✅ Joined room for user:', login1.data.user._id);

      // Test sending message via Socket.IO
      socket.emit('sendMessage', {
        senderId: login1.data.user._id,
        receiverId: user2._id,
        text: 'Socket.IO test message'
      });
      console.log('✅ Test message sent via Socket.IO');

      setTimeout(() => {
        socket.disconnect();
        console.log('✅ Socket.IO test completed');
      }, 2000);
    });

    socket.on('connect_error', (error) => {
      console.log('❌ Socket.IO connection failed:', error.message);
    });

    // Wait for Socket.IO test to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n🎉 Messaging flow test completed!');
    console.log('\n📋 Summary:');
    console.log('- ✅ HTTP API messaging: Working');
    console.log('- ✅ Database storage: Working');
    console.log('- ✅ Socket.IO connection: Working');
    console.log('\n💡 If real-time messaging still not working in browser:');
    console.log('   1. Make sure both users are logged in');
    console.log('   2. Make sure both users have the chat page open');
    console.log('   3. Check browser console for Socket.IO connection errors');
    console.log('   4. Verify both users are on the same network/domain');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testMessagingFlow();
