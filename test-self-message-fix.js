import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testSelfMessageFix() {
  console.log('🧪 Testing Self-Message Fix...\n');

  try {
    // Login as Alice
    console.log('1. Logging in as Alice...');
    const login = await axios.post(`${API_BASE}/auth/login`, {
      email: 'alice@example.com',
      password: 'password123'
    }, { withCredentials: true });

    const userId = login.data.user.id;
    const token = login.data.token;
    console.log(`✅ Logged in (ID: ${userId})`);

    // Send message to self
    console.log('\n2. Sending message to self...');
    await axios.post(`${API_BASE}/messages`, {
      receiverId: userId,
      text: 'Self-test message - should not create notification'
    }, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    console.log('✅ Self-message sent');

    // Check notifications
    console.log('\n3. Checking notifications...');
    const notifications = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    const messageNotifications = notifications.data.filter(n => n.type === 'message');
    const selfNotifications = messageNotifications.filter(n =>
      n.message.includes('Self-test message')
    );

    console.log(`📬 Found ${selfNotifications.length} self-message notifications`);

    if (selfNotifications.length === 0) {
      console.log('\n✅ SUCCESS: No notification created for self-message');
      console.log('🎉 Self-message fix is working correctly!');
    } else {
      console.log('\n❌ FAILED: Self-message created notification');
      console.log('Notification:', selfNotifications[0]);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
}

testSelfMessageFix();
