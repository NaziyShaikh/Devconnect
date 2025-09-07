import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

console.log('🔍 Testing Complete Project Flow with Authentication...\n');

// Global variables to store auth data
let authToken = '';
let userId = '';
let projectId = '';

async function registerAndLogin() {
  try {
    console.log('1. Registering test user...');
    const timestamp = Date.now();
    const registerRes = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Project Test User',
      email: `projecttest${timestamp}@example.com`,
      password: 'password123'
    }, { withCredentials: true });

    console.log('✅ Registration successful');

    console.log('2. Logging in...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: `projecttest${timestamp}@example.com`,
      password: 'password123'
    }, { withCredentials: true });

    authToken = loginRes.data.token;
    userId = loginRes.data.user.id;
    console.log('✅ Login successful, token received');
    return true;
  } catch (error) {
    console.log('❌ Auth failed:', error.response?.data || error.message);
    return false;
  }
}

async function testProjectCreation() {
  try {
    console.log('\n3. Creating test project...');
    const response = await axios.post(`${API_BASE}/projects`, {
      title: 'Test Collaboration Project',
      description: 'A project to test collaboration features and real-time notifications',
      techStack: ['React', 'Node.js', 'Socket.IO'],
      rolesNeeded: ['Frontend Developer', 'Backend Developer']
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });

    projectId = response.data._id;
    console.log('✅ Project created successfully:', response.data.title);
    return true;
  } catch (error) {
    console.log('❌ Project creation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetProjects() {
  try {
    console.log('\n4. Fetching all projects...');
    const response = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });

    console.log(`✅ Retrieved ${response.data.length} projects`);
    return true;
  } catch (error) {
    console.log('❌ Get projects failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetMyProjects() {
  try {
    console.log('\n5. Testing My Projects filter...');
    const response = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });

    const myProjects = response.data.filter(project => project.owner._id === userId);
    console.log(`✅ Found ${myProjects.length} projects owned by current user`);
    return true;
  } catch (error) {
    console.log('❌ My Projects test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testProjectDetails() {
  try {
    console.log('\n6. Fetching project details...');
    const response = await axios.get(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });

    console.log('✅ Project details retrieved:', response.data.title);
    return true;
  } catch (error) {
    console.log('❌ Project details failed:', error.response?.data || error.message);
    return false;
  }
}

async function testProjectUpdate() {
  try {
    console.log('\n7. Updating project...');
    const response = await axios.put(`${API_BASE}/projects/${projectId}`, {
      description: 'Updated description for testing collaboration features',
      status: 'In Progress'
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });

    console.log('✅ Project updated successfully');
    return true;
  } catch (error) {
    console.log('❌ Project update failed:', error.response?.data || error.message);
    return false;
  }
}

async function testJoinRequest() {
  try {
    console.log('\n8. Testing join request (will fail without second user, but tests endpoint)...');
    const response = await axios.post(`${API_BASE}/projects/${projectId}/request`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });

    console.log('❌ Join request result:', response.data);
    return true;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.msg === 'Already requested') {
      console.log('✅ Join request endpoint working (already requested)');
      return true;
    }
    console.log('❌ Join request failed:', error.response?.data || error.message);
    return false;
  }
}

async function testNotifications() {
  try {
    console.log('\n9. Testing notifications...');
    const response = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });

    console.log(`✅ Retrieved ${response.data.length} notifications`);
    return true;
  } catch (error) {
    console.log('❌ Notifications failed:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive project flow tests...\n');

  const authSuccess = await registerAndLogin();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  let testsPassed = 0;
  let totalTests = 0;

  // Test project creation
  totalTests++;
  if (await testProjectCreation()) testsPassed++;

  // Test get projects
  totalTests++;
  if (await testGetProjects()) testsPassed++;

  // Test my projects filter
  totalTests++;
  if (await testGetMyProjects()) testsPassed++;

  // Test project details
  totalTests++;
  if (await testProjectDetails()) testsPassed++;

  // Test project update
  totalTests++;
  if (await testProjectUpdate()) testsPassed++;

  // Test join request
  totalTests++;
  if (await testJoinRequest()) testsPassed++;

  // Test notifications
  totalTests++;
  if (await testNotifications()) testsPassed++;

  console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);

  if (testsPassed === totalTests) {
    console.log('🎉 All tests passed! Project endpoints are working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
}

runAllTests().catch(console.error);
