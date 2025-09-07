import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testFileUpload() {
  try {
    console.log('🧪 Testing File Upload Functionality...\n');

    // Step 1: Register and login
    console.log('1. Registering test user...');
    const timestamp = Date.now();
    const testEmail = `uploadtest${timestamp}@example.com`;

    await axios.post(`${API_BASE}/auth/register`, {
      name: 'Upload Test User',
      email: testEmail,
      password: 'password123'
    });

    console.log('✅ User registered');

    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Test file upload
    console.log('\n3. Testing file upload...');

    // Create a simple test file
    const testFilePath = path.join(process.cwd(), 'test-image.png');

    // Check if test file exists, if not create a simple one
    if (!fs.existsSync(testFilePath)) {
      console.log('Creating test image file...');
      // Create a minimal PNG file (1x1 transparent pixel)
      const pngData = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // Width: 1
        0x00, 0x00, 0x00, 0x01, // Height: 1
        0x08, 0x06, 0x00, 0x00, 0x00, // Bit depth: 8, Color type: 6 (RGBA), Compression: 0, Filter: 0, Interlace: 0
        0x1F, 0xF3, 0xFF, 0x61, // CRC
        0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // Compressed data
        0x0D, 0x0A, 0x2D, 0xB4, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
      ]);
      fs.writeFileSync(testFilePath, pngData);
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    // Upload file
    const uploadResponse = await axios.post(`${API_BASE}/upload/image`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ File uploaded successfully!');
    console.log('Upload response:', uploadResponse.data);

    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }

    console.log('\n🎉 File upload functionality is working!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testFileUpload();
