import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testFileUploadOnly() {
  try {
    console.log('🧪 Testing File Upload Only...\n');

    // Step 1: Register and login user
    console.log('1. Registering and logging in test user...');
    const timestamp = Date.now();
    const email = `fileupload${timestamp}@example.com`;

    await axios.post(`${API_BASE}/auth/register`, {
      name: 'File Upload User',
      email: email,
      password: 'password123'
    });

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: email,
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('✅ User logged in');

    // Step 2: Test file upload endpoint
    console.log('\n2. Testing file upload endpoint...');

    // Create a simple test image file
    const testImagePath = path.join(process.cwd(), 'test-upload.png');
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41, 0x54,
      0x78, 0xDA, 0x63, 0x64, 0x60, 0xF8, 0x5F, 0x0F, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
      0xAE, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(testImagePath, pngData);

    const uploadData = new FormData();
    uploadData.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-upload.png',
      contentType: 'image/png'
    });

    console.log('📤 Sending file upload request...');
    const uploadResponse = await axios.post(`${API_BASE}/upload/image`, uploadData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...uploadData.getHeaders()
      }
    });

    console.log('✅ File upload successful:', uploadResponse.data);

    // Clean up test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }

    console.log('\n🎉 File upload test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
    }
  }
}

// Run the test
testFileUploadOnly();
