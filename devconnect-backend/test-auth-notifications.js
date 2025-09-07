import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

async function testAuthAndNotifications() {
  console.log('🧪 Testing Authentication and Notifications...\n');

  try {
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const login = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@devconnect.com',
      password: 'admin123'
    }, { withCredentials: true });

    console.log('✅ Login successful:', login.data.user.name);

    // Step 2: Test /auth/me endpoint
    console.log('\n2️⃣ Testing /auth/me endpoint...');
    const me = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Cookie: login.headers['set-cookie']?.join('; ') }
    });
    console.log('✅ /auth/me working:', me.data.name);

    // Step 3: Test notifications endpoint
    console.log('\n3️⃣ Testing notifications endpoint...');
    const notifications = await axios.get(`${API_BASE}/notifications`, {
      headers: { Cookie: login.headers['set-cookie']?.join('; ') }
    });
    console.log('✅ Notifications endpoint working:', notifications.data.length, 'notifications');

    // Step 4: Test users endpoint
    console.log('\n4️⃣ Testing users endpoint...');
    const users = await axios.get(`${API_BASE}/users`, {
      headers: { Cookie: login.headers['set-cookie']?.join('; ') }
    });
    console.log('✅ Users endpoint working:', users.data.length, 'users found');

    console.log('\n🎉 All authentication and notification endpoints working!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthAndNotifications();
