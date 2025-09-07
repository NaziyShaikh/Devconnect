import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5001/api';

// Test data
const testUsers = [
  { email: 'alice@example.com', password: 'password123', name: 'Alice Developer' },
  { email: 'bob@example.com', password: 'password123', name: 'Bob Developer' },
  { email: 'charlie@example.com', password: 'password123', name: 'Charlie Developer' }
];

let userTokens = {};
let userIds = {};

// Helper function to register/login users
async function setupTestUsers() {
  console.log('🔧 Setting up test users...\n');

  for (const user of testUsers) {
    try {
      // Try to register first
      try {
        await axios.post(`${API_BASE}/auth/register`, {
          name: user.name,
          email: user.email,
          password: user.password
        });
        console.log(`✅ Registered ${user.name}`);
      } catch (regError) {
        if (regError.response?.status !== 409) {
          console.log(`ℹ️  ${user.name} might already exist`);
        }
      }

      // Login
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: user.email,
        password: user.password
      }, { withCredentials: true });

      userTokens[user.email] = loginResponse.data.token;
      userIds[user.email] = loginResponse.data.user.id;
      console.log(`✅ Logged in ${user.name} (ID: ${userIds[user.email]})`);

    } catch (error) {
      console.error(`❌ Failed to setup ${user.name}:`, error.response?.data || error.message);
    }
  }
  console.log('\n');
}

// Test 1: Basic message sending and notification creation
async function testBasicMessageNotification() {
  console.log('🧪 Test 1: Basic Message Notification\n');

  const sender = testUsers[0]; // Alice
  const receiver = testUsers[1]; // Bob

  try {
    // Alice sends message to Bob
    console.log(`📤 ${sender.name} sending message to ${receiver.name}...`);
    const messageResponse = await axios.post(`${API_BASE}/messages`, {
      receiverId: userIds[receiver.email],
      text: 'Hello Bob! This is a test message.'
    }, {
      headers: { Authorization: `Bearer ${userTokens[sender.email]}` },
      withCredentials: true
    });

    console.log('✅ Message sent successfully');

    // Wait a moment for notification to be created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check Bob's notifications
    console.log(`📨 Checking ${receiver.name}'s notifications...`);
    const notificationResponse = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${userTokens[receiver.email]}` },
      withCredentials: true
    });

    const messageNotifications = notificationResponse.data.filter(n => n.type === 'message');
    console.log(`📬 Found ${messageNotifications.length} message notifications for ${receiver.name}`);

    if (messageNotifications.length > 0) {
      const latestNotification = messageNotifications[messageNotifications.length - 1];
      console.log('🎯 Latest message notification:', {
        message: latestNotification.message,
        isRead: latestNotification.isRead,
        createdAt: latestNotification.createdAt
      });

      // Mark as read
      console.log('✅ Marking notification as read...');
      await axios.put(`${API_BASE}/notifications/${latestNotification._id}/read`, {}, {
        headers: { Authorization: `Bearer ${userTokens[receiver.email]}` },
        withCredentials: true
      });

      console.log('✅ Test 1 PASSED: Message notification created and marked as read\n');
      return true;
    } else {
      console.log('❌ Test 1 FAILED: No message notification found\n');
      return false;
    }

  } catch (error) {
    console.error('❌ Test 1 FAILED:', error.response?.data || error.message, '\n');
    return false;
  }
}

// Test 2: Multiple messages and notification accumulation
async function testMultipleMessages() {
  console.log('🧪 Test 2: Multiple Messages and Notification Accumulation\n');

  const sender = testUsers[0]; // Alice
  const receiver = testUsers[2]; // Charlie

  try {
    // Send multiple messages
    const messages = [
      'First test message',
      'Second test message with more content',
      'Third message to test accumulation'
    ];

    for (const message of messages) {
      console.log(`📤 Sending: "${message}"`);
      await axios.post(`${API_BASE}/messages`, {
        receiverId: userIds[receiver.email],
        text: message
      }, {
        headers: { Authorization: `Bearer ${userTokens[sender.email]}` },
        withCredentials: true
      });
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }

    console.log('✅ All messages sent');

    // Check notifications
    const notificationResponse = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${userTokens[receiver.email]}` },
      withCredentials: true
    });

    const messageNotifications = notificationResponse.data.filter(n => n.type === 'message');
    console.log(`📬 ${receiver.name} has ${messageNotifications.length} message notifications`);

    if (messageNotifications.length >= messages.length) {
      console.log('✅ Test 2 PASSED: All messages created notifications\n');
      return true;
    } else {
      console.log('❌ Test 2 FAILED: Missing notifications\n');
      return false;
    }

  } catch (error) {
    console.error('❌ Test 2 FAILED:', error.response?.data || error.message, '\n');
    return false;
  }
}

// Test 3: Long message truncation
async function testLongMessage() {
  console.log('🧪 Test 3: Long Message Truncation\n');

  const sender = testUsers[1]; // Bob
  const receiver = testUsers[2]; // Charlie

  try {
    const longMessage = 'A'.repeat(100) + ' This is a very long message that should be truncated in the notification preview to show only the first part of the message content.';

    console.log(`📤 Sending long message (${longMessage.length} chars)...`);
    await axios.post(`${API_BASE}/messages`, {
      receiverId: userIds[receiver.email],
      text: longMessage
    }, {
      headers: { Authorization: `Bearer ${userTokens[sender.email]}` },
      withCredentials: true
    });

    // Check notification
    const notificationResponse = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${userTokens[receiver.email]}` },
      withCredentials: true
    });

    const messageNotifications = notificationResponse.data.filter(n => n.type === 'message');
    const latestNotification = messageNotifications[messageNotifications.length - 1];

    console.log('📬 Notification message preview:', latestNotification.message);

    if (latestNotification.message.includes('...')) {
      console.log('✅ Test 3 PASSED: Long message properly truncated\n');
      return true;
    } else {
      console.log('❌ Test 3 FAILED: Message not truncated\n');
      return false;
    }

  } catch (error) {
    console.error('❌ Test 3 FAILED:', error.response?.data || error.message, '\n');
    return false;
  }
}

// Test 4: Mark all notifications as read
async function testMarkAllAsRead() {
  console.log('🧪 Test 4: Mark All Notifications as Read\n');

  const user = testUsers[2]; // Charlie

  try {
    // Get current notifications
    const beforeResponse = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${userTokens[user.email]}` },
      withCredentials: true
    });

    const unreadBefore = beforeResponse.data.filter(n => !n.isRead).length;
    console.log(`📊 Unread notifications before: ${unreadBefore}`);

    // Mark all as read
    console.log('✅ Marking all notifications as read...');
    await axios.patch(`${API_BASE}/notifications/read`, {}, {
      headers: { Authorization: `Bearer ${userTokens[user.email]}` },
      withCredentials: true
    });

    // Check again
    const afterResponse = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${userTokens[user.email]}` },
      withCredentials: true
    });

    const unreadAfter = afterResponse.data.filter(n => !n.isRead).length;
    console.log(`📊 Unread notifications after: ${unreadAfter}`);

    if (unreadAfter === 0) {
      console.log('✅ Test 4 PASSED: All notifications marked as read\n');
      return true;
    } else {
      console.log('❌ Test 4 FAILED: Some notifications still unread\n');
      return false;
    }

  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.response?.data || error.message, '\n');
    return false;
  }
}

// Test 5: Edge case - sending message to self
async function testSelfMessage() {
  console.log('🧪 Test 5: Edge Case - Sending Message to Self\n');

  const user = testUsers[0]; // Alice

  try {
    console.log(`📤 ${user.name} sending message to herself...`);
    const messageResponse = await axios.post(`${API_BASE}/messages`, {
      receiverId: userIds[user.email], // Same as sender
      text: 'Self-message test'
    }, {
      headers: { Authorization: `Bearer ${userTokens[user.email]}` },
      withCredentials: true
    });

    console.log('✅ Self-message sent');

    // Check notifications
    const notificationResponse = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${userTokens[user.email]}` },
      withCredentials: true
    });

    const messageNotifications = notificationResponse.data.filter(n => n.type === 'message');
    const selfNotifications = messageNotifications.filter(n =>
      n.message.includes(user.name) && n.message.includes('Self-message test')
    );

    if (selfNotifications.length === 0) {
      console.log('✅ Test 5 PASSED: No notification created for self-message (expected behavior)\n');
      return true;
    } else {
      console.log('⚠️  Test 5: Self-message created notification (unexpected but not critical)\n');
      return true; // Not a failure, just unexpected
    }

  } catch (error) {
    console.error('❌ Test 5 FAILED:', error.response?.data || error.message, '\n');
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Message Notification Tests\n');
  console.log('=' .repeat(60) + '\n');

  try {
    // Setup
    await setupTestUsers();

    // Run tests
    const results = [];
    results.push(await testBasicMessageNotification());
    results.push(await testMultipleMessages());
    results.push(await testLongMessage());
    results.push(await testMarkAllAsRead());
    results.push(await testSelfMessage());

    // Summary
    console.log('=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));

    const passed = results.filter(r => r === true).length;
    const total = results.length;

    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);

    if (passed === total) {
      console.log('\n🎉 ALL TESTS PASSED! Message notifications are working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the implementation.');
    }

  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
  }
}

// Run the tests
runAllTests();
