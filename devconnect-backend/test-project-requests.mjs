import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

console.log('🔍 Testing Project Requests Flow...\n');

// Global variables to store auth data
let authToken1 = '';
let authToken2 = '';
let userId1 = '';
let userId2 = '';
let projectId = '';

async function registerAndLoginUsers() {
  try {
    console.log('1. Registering and logging in User 1 (Project Owner)...');
    const registerRes1 = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Project Owner',
      email: `owner${Date.now()}@example.com`,
      password: 'password123'
    }, { withCredentials: true });

    const loginRes1 = await axios.post(`${API_BASE}/auth/login`, {
      email: registerRes1.data.user.email,
      password: 'password123'
    }, { withCredentials: true });

    authToken1 = loginRes1.data.token;
    userId1 = loginRes1.data.user.id;
    console.log('✅ User 1 logged in successfully');

    console.log('2. Registering and logging in User 2 (Collaborator)...');
    const registerRes2 = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Collaborator',
      email: `collaborator${Date.now()}@example.com`,
      password: 'password123'
    }, { withCredentials: true });

    const loginRes2 = await axios.post(`${API_BASE}/auth/login`, {
      email: registerRes2.data.user.email,
      password: 'password123'
    }, { withCredentials: true });

    authToken2 = loginRes2.data.token;
    userId2 = loginRes2.data.user.id;
    console.log('✅ User 2 logged in successfully');

    return true;
  } catch (error) {
    console.log('❌ Auth failed:', error.response?.data || error.message);
    return false;
  }
}

async function createProject() {
  try {
    console.log('\n3. Creating test project...');
    const response = await axios.post(`${API_BASE}/projects`, {
      title: 'Test Collaboration Project',
      description: 'A project to test collaboration features',
      techStack: ['React', 'Node.js'],
      rolesNeeded: ['Frontend Developer', 'Backend Developer']
    }, {
      headers: { Authorization: `Bearer ${authToken1}` },
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

async function sendJoinRequest() {
  try {
    console.log('\n4. User 2 sending join request...');
    const response = await axios.post(`${API_BASE}/projects/${projectId}/request`, {}, {
      headers: { Authorization: `Bearer ${authToken2}` },
      withCredentials: true
    });

    console.log('✅ Join request sent:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Join request failed:', error.response?.data || error.message);
    return false;
  }
}

async function checkProjectRequests() {
  try {
    console.log('\n5. Checking project requests as owner...');
    const response = await axios.get(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${authToken1}` },
      withCredentials: true
    });

    console.log('✅ Project data retrieved');
    console.log('Requests count:', response.data.requests?.length || 0);
    console.log('Requests:', response.data.requests);

    return response.data.requests?.length > 0;
  } catch (error) {
    console.log('❌ Failed to get project data:', error.response?.data || error.message);
    return false;
  }
}

async function acceptRequest() {
  try {
    console.log('\n6. Owner accepting the join request...');
    const response = await axios.patch(`${API_BASE}/projects/${projectId}/respond`, {
      userId: userId2,
      accept: true
    }, {
      headers: { Authorization: `Bearer ${authToken1}` },
      withCredentials: true
    });

    console.log('✅ Request accepted:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Accept request failed:', error.response?.data || error.message);
    return false;
  }
}

async function verifyCollaboration() {
  try {
    console.log('\n7. Verifying collaboration was added...');
    const response = await axios.get(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${authToken1}` },
      withCredentials: true
    });

    const isCollaborator = response.data.collaborators?.some(id => id.toString() === userId2);
    console.log('✅ User 2 is collaborator:', isCollaborator);
    console.log('Collaborators:', response.data.collaborators);

    return isCollaborator;
  } catch (error) {
    console.log('❌ Verification failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTest() {
  console.log('🚀 Starting Project Requests Test...\n');

  const authSuccess = await registerAndLoginUsers();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  let testsPassed = 0;
  let totalTests = 0;

  // Test project creation
  totalTests++;
  if (await createProject()) testsPassed++;

  // Test join request
  totalTests++;
  if (await sendJoinRequest()) testsPassed++;

  // Test checking requests
  totalTests++;
  if (await checkProjectRequests()) testsPassed++;

  // Test accepting request
  totalTests++;
  if (await acceptRequest()) testsPassed++;

  // Test verification
  totalTests++;
  if (await verifyCollaboration()) testsPassed++;

  console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);

  if (testsPassed === totalTests) {
    console.log('🎉 All project request tests passed! The collaboration feature is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
}

runTest().catch(console.error);
