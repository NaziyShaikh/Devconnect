// Test script for authentication system
// Run this in your browser console or use as a reference for manual testing

console.log('=== DevConnect Authentication Test ===');

// Test configuration
const API_BASE = 'http://localhost:5001/api';
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'developer'
};

// Test functions
async function testRegistration() {
  console.log('🧪 Testing Registration...');
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Registration Response:', data);
    
    if (response.ok) {
      console.log('✅ Registration successful');
      return data.token;
    } else {
      console.error('❌ Registration failed:', data.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return null;
  }
}

async function testLogin() {
  console.log('🧪 Testing Login...');
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      }),
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Login Response:', data);
    
    if (response.ok) {
      console.log('✅ Login successful');
      return data.token;
    } else {
      console.error('❌ Login failed:', data.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return null;
  }
}

async function testCurrentUser(token) {
  console.log('🧪 Testing Current User...');
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Current User Response:', data);
    
    if (response.ok) {
      console.log('✅ Current user fetch successful');
      return data;
    } else {
      console.error('❌ Current user fetch failed:', data.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ Current user error:', error);
    return null;
  }
}

async function testLogout(token) {
  console.log('🧪 Testing Logout...');
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('Logout Response:', data);
    
    if (response.ok) {
      console.log('✅ Logout successful');
      return true;
    } else {
      console.error('❌ Logout failed:', data.msg);
      return false;
    }
  } catch (error) {
    console.error('❌ Logout error:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Starting authentication tests...\n');
  
  // Test registration
  const registrationToken = await testRegistration();
  
  if (registrationToken) {
    // Test login
    const loginToken = await testLogin();
    
    if (loginToken) {
      // Test current user
      await testCurrentUser(loginToken);
      
      // Test logout
      await testLogout(loginToken);
    }
  }
  
  console.log('\n=== Test Complete ===');
}

// Manual testing instructions
console.log(`
=== Manual Testing Instructions ===

1. Start the backend server:
   cd devconnect-backend
   npm run dev

2. Start the frontend:
   cd devconnect-client-new
   npm start

3. Test Registration:
   - Navigate to http://localhost:3000/register
   - Fill in: name, email, password, role
   - Submit and check console for response

4. Test Login:
   - Navigate to http://localhost:3000/login
   - Use same email/password as registration
   - Check if redirected to /developers

5. Test Token Persistence:
   - Refresh page after login
   - Check if user stays logged in

6. Test Protected Routes:
   - Try accessing /developers without login
   - Should redirect to login page

=== Common Issues & Solutions ===

1. CORS Error:
   - Ensure backend is running on port 5001
   - Check CLIENT_URL in .env matches frontend URL

2. Token Not Stored:
   - Check browser dev tools > Application > Local Storage
   - Look for 'token' key

3. 401 Unauthorized:
   - Ensure JWT_SECRET is set in backend .env
   - Check token is being sent in Authorization header

4. Database Connection:
   - Ensure MongoDB is running
   - Check MONGO_URI in backend .env
`);
