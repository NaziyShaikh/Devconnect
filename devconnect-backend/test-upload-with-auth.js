import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5001/api';

console.log('🔍 Testing Upload Endpoints with Authentication...\n');

// Create a small test image file
function createTestImage() {
  // Create a simple 1x1 pixel PNG as base64
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(base64Image, 'base64');
  const testImagePath = path.join(process.cwd(), 'test-image.png');
  fs.writeFileSync(testImagePath, buffer);
  return testImagePath;
}

// Test 0: Register and Login to get token
async function registerAndLogin() {
  try {
    console.log('0. Registering test user...');
    await axios.post(`${API_BASE}/auth/register`, {
      name: 'Upload Test User',
      email: 'upload-test@example.com',
      password: 'password123'
    }, {
      withCredentials: true
    });

    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'upload-test@example.com',
      password: 'password123'
    }, {
      withCredentials: true
    });

    console.log('✅ Login successful');
    return loginResponse.data.token;
  } catch (error) {
    console.log('❌ Auth failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 1: Upload image with JWT token in header
async function testUploadWithJWT(token) {
  try {
    console.log('\n2. Testing image upload with JWT token...');
    const testImagePath = createTestImage();

    const formData = new FormData();
    const imageBuffer = fs.readFileSync(testImagePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('file', imageBlob, 'test-image.png');

    const response = await axios.post(`${API_BASE}/upload/image`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    console.log('✅ Image upload successful:', response.data);

    // Clean up test file
    fs.unlinkSync(testImagePath);
    return response.data;
  } catch (error) {
    console.log('❌ Image upload failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Upload resume with JWT token
async function testResumeUploadWithJWT(token) {
  try {
    console.log('\n3. Testing resume upload with JWT token...');
    // Create a simple text file as resume
    const resumeContent = 'This is a test resume file.';
    const resumePath = path.join(process.cwd(), 'test-resume.txt');
    fs.writeFileSync(resumePath, resumeContent);

    const formData = new FormData();
    const resumeBuffer = fs.readFileSync(resumePath);
    const resumeBlob = new Blob([resumeBuffer], { type: 'text/plain' });
    formData.append('file', resumeBlob, 'test-resume.txt');

    const response = await axios.post(`${API_BASE}/upload/resume`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    console.log('✅ Resume upload successful:', response.data);

    // Clean up test file
    fs.unlinkSync(resumePath);
    return response.data;
  } catch (error) {
    console.log('❌ Resume upload failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Test upload without authentication
async function testUploadWithoutAuth() {
  try {
    console.log('\n4. Testing upload without authentication...');
    const testImagePath = createTestImage();

    const formData = new FormData();
    const imageBuffer = fs.readFileSync(testImagePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('file', imageBlob, 'test-image.png');

    const response = await axios.post(`${API_BASE}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('❌ Upload should have failed but succeeded:', response.data);
    fs.unlinkSync(testImagePath);
    return response.data;
  } catch (error) {
    console.log('✅ Upload correctly failed without auth:', error.response?.data || error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  const token = await registerAndLogin();
  if (token) {
    await testUploadWithJWT(token);
    await testResumeUploadWithJWT(token);
    await testUploadWithoutAuth();
  }

  console.log('\n🎯 Upload testing completed!');
}

runTests().catch(console.error);
