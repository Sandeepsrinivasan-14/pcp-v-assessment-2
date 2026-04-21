// test-api-fetch.js
const API_BASE_URL = 'https://t4e-testserver.onrender.com/api';

const testWithFetch = async () => {
  const credentials = [
    { studentId: 'e0423027', password: '203264' },
    { studentId: 'E0423027', password: '203264' },
    { studentId: 'e0423027', password: 'E0423027' },
    { studentId: 'SANDEEP', password: '203264' }
  ];
  
  for (const cred of credentials) {
    try {
      console.log(`Testing: ${cred.studentId} / ${cred.password}`);
      const response = await fetch(`${API_BASE_URL}/public/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('? SUCCESS! Token:', data.token);
        return;
      } else {
        console.log('? Failed:', data.message);
      }
    } catch (err) {
      console.log('? Error:', err.message);
    }
  }
};

testWithFetch();
