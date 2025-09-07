const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testProjectEndpoints() {
  try {
    console.log('Testing project endpoints...');

    // Test GET /projects
    const projectsRes = await axios.get(`${baseURL}/projects`, {
      headers: { Authorization: 'Bearer test-token' }
    });
    console.log('GET /projects:', projectsRes.status);

    // Test POST /projects
    const createRes = await axios.post(`${baseURL}/projects`, {
      title: 'Test Project',
      description: 'Test Description',
      techStack: ['React', 'Node.js'],
      rolesNeeded: ['Frontend Developer']
    }, {
      headers: { Authorization: 'Bearer test-token' }
    });
    console.log('POST /projects:', createRes.status);

    console.log('Project endpoints working!');
  } catch (err) {
    console.log('Error:', err.response?.status || err.message);
  }
}

testProjectEndpoints();
