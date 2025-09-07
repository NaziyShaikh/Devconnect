import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function testAdminEndpoints() {
  console.log('🛡️  Testing Admin Endpoints...\n');

  try {
    // First, login as admin (assuming there's an admin user)
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@devconnect.com',
      password: 'admin123'
    }, { withCredentials: true });

    console.log('✅ Admin login successful\n');

    // Test getting all users
    console.log('2. Getting all users...');
    const usersResponse = await axios.get(`${API_URL}/admin/users`, {
      withCredentials: true
    });
    console.log(`✅ Found ${usersResponse.data.length} users\n`);

    // Test getting all projects
    console.log('3. Getting all projects...');
    const projectsResponse = await axios.get(`${API_URL}/admin/projects`, {
      withCredentials: true
    });
    console.log(`✅ Found ${projectsResponse.data.length} projects\n`);

    // Test getting reports
    console.log('4. Getting reports...');
    const reportsResponse = await axios.get(`${API_URL}/admin/reports`, {
      withCredentials: true
    });
    console.log(`✅ Found ${reportsResponse.data.length} reports\n`);

    console.log('🎯 Admin endpoints testing completed successfully!');

  } catch (error) {
    console.error('❌ Admin endpoints test failed:', error.response?.data || error.message);

    if (error.response?.status === 403) {
      console.log('\n💡 Note: Make sure you have an admin user with role: "admin"');
      console.log('   Or the user you\'re testing with needs admin privileges');
    }
  }
}

testAdminEndpoints();
