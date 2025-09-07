const axios = require('axios');

// Register an admin user through the API
const BASE_URL = 'http://localhost:5001/api';

async function registerAdmin() {
  console.log('🛠️  Registering admin user through API...');

  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Admin User',
      email: 'admin@devconnect.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user registered successfully!');
    console.log('Response:', response.data);
    console.log('\n📋 Admin credentials:');
    console.log('Email: admin@devconnect.com');
    console.log('Password: admin123');

  } catch (error) {
    console.log('❌ Registration failed:', error.message);

    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }

    // If admin already exists, that's fine
    if (error.response?.data?.msg?.includes('already registered')) {
      console.log('ℹ️  Admin user already exists');
      console.log('Email: admin@devconnect.com');
      console.log('Password: admin123');
    }
  }
}

registerAdmin();
