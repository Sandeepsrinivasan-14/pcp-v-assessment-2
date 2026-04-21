// Complete API Test Script
const API_BASE_URL = 'https://t4e-testserver.onrender.com/api';

async function testAllMethods() {
  console.log('?? TESTING ALL AUTHENTICATION METHODS\n');
  
  const credentials = [
    { studentId: 'e0423027', password: '203264' },
    { studentId: 'E0423027', password: '203264' },
    { studentId: '0423027', password: '203264' },
    { studentId: 'SANDEEP', password: '203264' },
    { studentId: 'SANDEEP SRINIVASAN S', password: '203264' },
    { studentId: 'sandeep', password: '203264' },
    { studentId: 'Sandeep', password: '203264' }
  ];
  
  for (const cred of credentials) {
    console.log(`\n?? Testing: ${cred.studentId}`);
    
    // Method 1: Standard POST
    try {
      const res1 = await fetch(`${API_BASE_URL}/public/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred)
      });
      const data1 = await res1.json();
      
      if (res1.ok) {
        console.log('? METHOD 1 SUCCESS! Token:', data1.token);
        console.log('?? WORKING CREDENTIALS FOUND:', cred);
        process.exit(0);
      } else {
        console.log('? Method 1:', data1.message);
      }
    } catch(e) { console.log('? Method 1 error:', e.message); }
    
    // Method 2: Form URL Encoded
    try {
      const params = new URLSearchParams();
      params.append('studentId', cred.studentId);
      params.append('password', cred.password);
      
      const res2 = await fetch(`${API_BASE_URL}/public/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      const data2 = await res2.json();
      
      if (res2.ok) {
        console.log('? METHOD 2 SUCCESS! Token:', data2.token);
        console.log('?? WORKING CREDENTIALS FOUND:', cred);
        process.exit(0);
      }
    } catch(e) {}
  }
  
  console.log('\n?? ALL CREDENTIALS AND METHODS FAILED');
  console.log('??  YOU MUST CONTACT YOUR TRAINER IMMEDIATELY');
}

testAllMethods();
