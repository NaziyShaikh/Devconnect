import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';
const timestamp = Date.now();
const testEmail1 = `projecttest1${timestamp}@example.com`;
const testEmail2 = `projecttest2${timestamp}@example.com`;

async function testProjectManagement() {
  console.log('🧪 Starting Project Management Tests...\n');

  try {
    // Test 1: Register First User
    console.log('1. Testing First User Registration...');
    const registerResponse1 = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Project Owner',
      email: testEmail1,
      password: 'password123'
    });
    console.log('✅ First user registered:', registerResponse1.data.user.email);

    // Test 2: Register Second User
    console.log('\n2. Testing Second User Registration...');
    const registerResponse2 = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Project Collaborator',
      email: testEmail2,
      password: 'password123'
    });
    console.log('✅ Second user registered:', registerResponse2.data.user.email);

    // Test 3: Login First User
    console.log('\n3. Testing First User Login...');
    const loginResponse1 = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail1,
      password: 'password123'
    });
    const token1 = loginResponse1.data.token;
    console.log('✅ First user login successful');

    // Test 4: Login Second User
    console.log('\n4. Testing Second User Login...');
    const loginResponse2 = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail2,
      password: 'password123'
    });
    const token2 = loginResponse2.data.token;
    console.log('✅ Second user login successful');

    // Test 5: Create Project
    console.log('\n5. Testing Project Creation...');
    const projectData = {
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform with React and Node.js',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
      rolesNeeded: ['Frontend Developer', 'Backend Developer', 'UI/UX Designer']
    };

    const createProjectResponse = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const projectId = createProjectResponse.data._id;
    console.log('✅ Project created successfully:', createProjectResponse.data.title);

    // Test 6: Get All Projects
    console.log('\n6. Testing Get All Projects...');
    const getProjectsResponse = await axios.get(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log('✅ Projects retrieved, total projects:', getProjectsResponse.data.length);

    // Test 7: Get Specific Project
    console.log('\n7. Testing Get Specific Project...');
    const getProjectResponse = await axios.get(`${BASE_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log('✅ Project details retrieved:', getProjectResponse.data.title);

    // Test 8: Request to Join Project (Second User)
    console.log('\n8. Testing Join Request...');
    const joinRequestResponse = await axios.post(`${BASE_URL}/projects/${projectId}/request`, {}, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ Join request sent successfully');

    // Test 9: Get Project with Requests (Owner)
    console.log('\n9. Testing Get Project with Join Requests...');
    const getProjectWithRequests = await axios.get(`${BASE_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log('✅ Project with requests retrieved, pending requests:', getProjectWithRequests.data.requests.length);

    // Test 10: Accept Join Request
    console.log('\n10. Testing Accept Join Request...');
    const acceptResponse = await axios.patch(`${BASE_URL}/projects/${projectId}/respond`, {
      userId: loginResponse2.data.user.id,
      accept: true
    }, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log('✅ Join request accepted successfully');

    // Test 11: Update Project
    console.log('\n11. Testing Project Update...');
    const updateData = {
      description: 'Updated: A full-stack e-commerce platform with React and Node.js - Now with enhanced features!',
      status: 'In Progress'
    };
    const updateResponse = await axios.put(`${BASE_URL}/projects/${projectId}`, updateData, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log('✅ Project updated successfully');

    // Test 12: Update Project Status
    console.log('\n12. Testing Project Status Update...');
    const statusResponse = await axios.patch(`${BASE_URL}/projects/${projectId}/status`, {
      status: 'Completed'
    }, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log('✅ Project status updated successfully');

    console.log('\n🎉 All Project Management tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testProjectManagement();
