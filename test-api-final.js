// test-api-final.js
const API_BASE_URL = 'https://t4e-testserver.onrender.com/api';

const testCredentials = async () => {
  const password = '203264';
  
  // Possible student ID formats
  const studentIds = [
    'SANDEEP SRINIVASAN S',
    'SANDEEP',
    'sandeep',
    'E0423027',
    'e0423027',
    '2021CS001',
    'CSE23AE104',
    'SANDEEP.S',
    'sandeep.srinivasan'
  ];
  
  for (const studentId of studentIds) {
    try {
      console.log(`Testing: "${studentId}" / ${password}`);
      const response = await fetch(`${API_BASE_URL}/public/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('? SUCCESS! Student ID:', studentId);
        console.log('?? Token:', data.token);
        return;
      } else {
        console.log('? Failed:', data.message);
      }
    } catch (err) {
      console.log('? Error:', err.message);
    }
  }
};

testCredentials();
