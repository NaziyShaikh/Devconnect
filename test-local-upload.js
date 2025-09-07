// Test script for local file upload
// Run with: node test-local-upload.js

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Create a test image file
const testImagePath = path.join(__dirname, 'test-image.jpg');
const testImageContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

// Write test image
fs.writeFileSync(testImagePath, testImageContent);

console.log('🧪 Testing local file upload...');

// Create form data
const formData = new FormData();
formData.append('file', fs.createReadStream(testImagePath));

// Test the local upload endpoint
axios.post('http://localhost:5001/api/local-upload/image', formData, {
  headers: {
    ...formData.getHeaders(),
    'Authorization': 'Bearer test-token' // This will fail auth but test the endpoint
  }
})
.then(response => {
  console.log('✅ Local upload test successful!');
  console.log('Response:', response.data);
  
  // Clean up test file
  fs.unlinkSync(testImagePath);
})
.catch(error => {
  console.log('❌ Local upload test failed:');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
  } else {
    console.log('Error:', error.message);
  }
  
  // Clean up test file
  fs.unlinkSync(testImagePath);
});
