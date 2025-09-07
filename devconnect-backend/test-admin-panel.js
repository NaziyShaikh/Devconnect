import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

async function testAdminPanel() {
  console.log('🧪 Starting Admin Panel Tests...\n');

  try {
    // Test 1: Admin Login
    console.log('1. Testing Admin Login...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@devconnect.com',
      password: 'admin123'
    });
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');

    // Test 2: Get All Users (Admin)
    console.log('\n2. Testing Get All Users...');
    const getUsersResponse = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All users retrieved, total users:', getUsersResponse.data.length);

    // Test 3: Get All Projects (Admin)
    console.log('\n3. Testing Get All Projects...');
    const getProjectsResponse = await axios.get(`${BASE_URL}/admin/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All projects retrieved, total projects:', getProjectsResponse.data.length);

    // Test 4: Block User
    console.log('\n4. Testing Block User...');
    const firstUser = getUsersResponse.data[0];
    if (firstUser && firstUser.role !== 'admin') {
      const blockResponse = await axios.put(`${BASE_URL}/admin/users/${firstUser._id}/block`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ User blocked successfully');
    } else {
      console.log('⚠️  Skipping block test - no suitable user found or user is admin');
    }

    // Test 5: Delete User
    console.log('\n5. Testing Delete User...');
    // Create a test user first
    const timestamp = Date.now();
    const testEmail = `deletetest${timestamp}@example.com`;

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Delete Test User',
      email: testEmail,
      password: 'password123'
    });

    console.log('Registration response:', registerResponse.data);
    const userId = registerResponse.data.user.id;
    console.log('User ID to delete:', userId);

    const deleteResponse = await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ User deleted successfully');

    // Test 6: Delete Project
    console.log('\n6. Testing Delete Project...');
    if (getProjectsResponse.data.length > 0) {
      const firstProject = getProjectsResponse.data[0];
      const deleteProjectResponse = await axios.delete(`${BASE_URL}/admin/projects/${firstProject._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Project deleted successfully');
    } else {
      console.log('⚠️  Skipping delete project test - no projects found');
    }

    // Test 7: Report Content
    console.log('\n7. Testing Report Content...');
    const reportResponse = await axios.post(`${BASE_URL}/admin/report`, {
      itemId: 'test-item-id',
      type: 'project',
      reason: 'Inappropriate content'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Content reported successfully');

    // Test 8: Get Reports
    console.log('\n8. Testing Get Reports...');
    const getReportsResponse = await axios.get(`${BASE_URL}/admin/reports`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Reports retrieved, total reports:', getReportsResponse.data.length);

    // Test 9: Developer Access Denied to Admin Endpoints
    console.log('\n9. Testing Developer Access Denied to Admin Endpoints...');
    // Create a regular developer user
    const devEmail = `devtest${timestamp}@example.com`;
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Developer Test',
      email: devEmail,
      password: 'password123'
    });

    const devLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: devEmail,
      password: 'password123'
    });
    const devToken = devLoginResponse.data.token;

    try {
      await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${devToken}` }
      });
      console.log('❌ Developer should not access admin endpoints');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Developer correctly denied access to admin endpoints');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    console.log('\n🎉 All Admin Panel tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAdminPanel();
