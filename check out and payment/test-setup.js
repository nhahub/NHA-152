// Quick test script to verify backend setup
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testServer() {
  console.log('🧪 Testing Backend Setup...\n');

  // Test 1: Check if server is running
  try {
    console.log('1️⃣ Testing server connection...');
    const checkAuth = await axios.get(`${API_URL}/auth/check-auth`, {
      validateStatus: () => true, // Don't throw on 401
      withCredentials: true
    });
    console.log('   ✅ Server is running!\n');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('   ❌ Server is not running. Please start it with: cd server && npm run dev\n');
      return;
    }
    console.log('   ⚠️  Server connection issue:', error.message);
  }

  // Test 2: Test registration endpoint
  try {
    console.log('2️⃣ Testing registration endpoint...');
    const testUser = {
      userName: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@test.com`,
      password: 'Test123456'
    };

    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser, {
      withCredentials: true,
      validateStatus: () => true
    });

    if (registerResponse.data.success) {
      console.log('   ✅ Registration endpoint working!');
      console.log(`   ✅ Test user created: ${testUser.userName}\n`);
      
      // Test 3: Login with test user
      try {
        console.log('3️⃣ Testing login endpoint...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        }, {
          withCredentials: true,
          validateStatus: () => true
        });

        if (loginResponse.data.success) {
          console.log('   ✅ Login endpoint working!');
          console.log('   ✅ User authenticated successfully\n');
        } else {
          console.log('   ❌ Login failed:', loginResponse.data.message);
        }
      } catch (error) {
        console.log('   ❌ Login test error:', error.message);
      }
    } else {
      console.log('   ⚠️  Registration response:', registerResponse.data.message);
    }
  } catch (error) {
    console.log('   ❌ Registration test error:', error.response?.data?.message || error.message);
  }

  console.log('\n✅ Backend setup test complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure server is running: cd server && npm run dev');
  console.log('   2. Start client: cd client && npm run dev');
  console.log('   3. Go to http://localhost:5173/auth/register to test registration');
}

testServer();

