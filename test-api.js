// test-api.js
import axios from 'axios';

const API_BASE_URL = 'https://t4e-testserver.onrender.com/api';

const testCredentials = async () => {
  console.log('?? Testing API credentials...\n');
  
  // List of possible student IDs to try
  const studentIds = [
    'e0423027',
    'E0423027', 
    '0423027',
    '2024e0423027',
    'e0423027@rmk',
    'SANDEEP',
    'sandeep'
  ];
  
  const password = '203264';
  
  for (const studentId of studentIds) {
    try {
      console.log(`?? Trying: ${studentId} / ${password}`);
      
      const response = await axios.post(`${API_BASE_URL}/public/token`, {
        studentId: studentId,
        password: password
      });
      
      console.log(`? SUCCESS with: ${studentId}`);
      console.log(`?? Token: ${response.data.token.substring(0, 50)}...`);
      console.log(`?? Full response:`, response.data);
      return;
      
    } catch (error) {
      if (error.response) {
        console.log(`? Failed: ${studentId} -> ${error.response.data.message || error.response.status}`);
      } else {
        console.log(`? Error: ${error.message}`);
      }
    }
  }
  
  
};

testCredentials();
