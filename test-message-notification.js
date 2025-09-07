import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5001/api';

// Test function to verify message notification creation
async function testMessageNotification() {
  try {
    console.log('🧪 Testing Message Notification Creation...\n');

    // Step 1: Register two test users
    console.log('1. Registering test users...');
    const timestamp = Date.now();
    const senderEmail = `messagenotif${timestamp}@example.com`;
    const receiverEmail = `messagenotif${timestamp + 1}@example.com`;

    // Register sender
    await axios.post(`${API_BASE}/auth/register`, {
      name: 'Message Test Sender',
      email: senderEmail,
      password: 'password123'
    });

    // Register receiver
    const receiverRegisterResponse = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Message Test Receiver',
      email: receiverEmail,
      password: 'password123'
    });

    const receiverId = receiverRegisterResponse.data.user.id;
    console.log('✅ Users registered');

    console.log('2. Logging in as sender...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: senderEmail,
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Send a message
    console.log('\n2. Sending message...');
    const messageResponse = await axios.post(`${API_BASE}/messages`, {
      receiverId: receiverId,
      text: 'Test message for notification'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Message sent:', messageResponse.data);

    // Step 3: Check notifications for the receiver
    console.log('\n3. Logging in as receiver to check notifications...');
    const receiverLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: receiverEmail,
      password: 'password123'
    });

    const receiverToken = receiverLoginResponse.data.token;

    const notificationResponse = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${receiverToken}` }
    });

    console.log('✅ Notifications retrieved:', notificationResponse.data);

    // Check if message notification was created
    const messageNotifications = notificationResponse.data.filter(n => n.type === 'message');
    console.log(`📨 Found ${messageNotifications.length} message notifications`);

    if (messageNotifications.length > 0) {
      console.log('🎉 SUCCESS: Message notifications are being created!');
      console.log('Sample notification:', messageNotifications[0]);
    } else {
      console.log('⚠️  WARNING: No message notifications found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testMessageNotification();
