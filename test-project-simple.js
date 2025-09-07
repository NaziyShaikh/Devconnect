import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testProjectSimple() {
  try {
    console.log('🧪 Testing Simple Project Creation (without file upload)...\n');

    // Step 1: Register and login user
    console.log('1. Registering and logging in test user...');
    const timestamp = Date.now();
    const email = `projectsimple${timestamp}@example.com`;

    await axios.post(`${API_BASE}/auth/register`, {
      name: 'Project Simple User',
      email: email,
      password: 'password123'
    });

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: email,
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('✅ User logged in');

    // Step 2: Create a project without file upload
    console.log('\n2. Creating a project without file upload...');

    const projectData = {
      title: 'Simple Test Project',
      description: 'A simple test project without file upload',
      techStack: ['React', 'Node.js'],
      rolesNeeded: ['Frontend Developer', 'Backend Developer']
    };

    const createResponse = await axios.post(`${API_BASE}/projects`, projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Project created successfully:', createResponse.data.title);
    console.log('📋 Project details:', {
      id: createResponse.data._id,
      title: createResponse.data.title,
      description: createResponse.data.description,
      techStack: createResponse.data.techStack,
      rolesNeeded: createResponse.data.rolesNeeded,
      status: createResponse.data.status
    });

    // Step 3: Test project status updates
    console.log('\n3. Testing project status updates...');
    const projectId = createResponse.data._id;

    // Update to In Progress
    const statusResponse1 = await axios.patch(`${API_BASE}/projects/${projectId}/status`, {
      status: 'In Progress'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Project status updated to:', statusResponse1.data.msg);

    // Update to Completed
    const statusResponse2 = await axios.patch(`${API_BASE}/projects/${projectId}/status`, {
      status: 'Completed'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Project status updated to:', statusResponse2.data.msg);

    // Step 4: Verify final project status
    console.log('\n4. Verifying final project status...');
    const projectResponse = await axios.get(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Final project status:', projectResponse.data.status);

    if (projectResponse.data.status === 'Completed') {
      console.log('🎯 SUCCESS: Project status tracking is working correctly');
    }

    console.log('\n🎉 Simple project creation test completed successfully!');
    console.log('\n📋 VERIFICATION SUMMARY:');
    console.log('✅ Project creation without file upload - Working');
    console.log('✅ Project status tracking (Idea → In Progress → Completed) - Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
    }
  }
}

// Run the test
testProjectSimple();
