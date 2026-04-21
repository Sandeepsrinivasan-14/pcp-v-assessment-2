// Complete API Service with Authentication & Tokenization
import axios from 'axios';

const API_BASE_URL = 'https://t4e-testserver.onrender.com/api';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Delay function for retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Step 1: Get authentication token from public API
 * @param {string} studentId - Your student ID/register number
 * @param {string} password - Your password from email
 * @returns {Promise<string>} - JWT token
 */
export const getToken = async (studentId, password) => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`?? Attempt ${attempt}: Getting token for ${studentId}...`);
      
      const response = await axios.post(`${API_BASE_URL}/public/token`, {
        studentId: studentId.trim(),
        password: password.trim()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      // Validate response
      if (!response.data || !response.data.token) {
        throw new Error('No token received from server');
      }
      
      console.log('? Token received successfully');
      return response.data.token;
      
    } catch (error) {
      lastError = error;
      console.error(`? Attempt ${attempt} failed:`, error.message);
      
      // Handle specific error cases
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            throw new Error(`Authentication failed: ${error.response.data?.message || 'Invalid credentials'}`);
          case 429:
            console.log('Rate limited, waiting before retry...');
            await delay(RETRY_DELAY * attempt);
            continue;
          default:
            if (attempt === MAX_RETRIES) {
              throw new Error(`API Error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
            }
        }
      } else if (error.code === 'ECONNABORTED') {
        if (attempt === MAX_RETRIES) {
          throw new Error('Connection timeout. Please check your network.');
        }
        await delay(RETRY_DELAY * attempt);
        continue;
      } else if (attempt === MAX_RETRIES) {
        throw new Error(`Network error: ${error.message}`);
      }
      
      // Wait before retry
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * attempt);
      }
    }
  }
  
  throw lastError || new Error('Failed to get token after multiple attempts');
};

/**
 * Step 2: Fetch orders data using authenticated token
 * @param {string} token - JWT token from getToken()
 * @returns {Promise<Array>} - Array of orders
 */
export const fetchOrders = async (token) => {
  if (!token || token.trim() === '') {
    throw new Error('No token provided. Please authenticate first.');
  }
  
  let lastError = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`?? Attempt ${attempt}: Fetching orders...`);
      
      const response = await axios.get(`${API_BASE_URL}/private/data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      });
      
      // Validate response
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Handle different response formats
      let orders = [];
      if (Array.isArray(response.data)) {
        orders = response.data;
      } else if (response.data.orders && Array.isArray(response.data.orders)) {
        orders = response.data.orders;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        orders = response.data.data;
      } else {
        console.warn('Unexpected response format:', response.data);
        orders = [];
      }
      
      console.log(`? Fetched ${orders.length} orders`);
      return orders;
      
    } catch (error) {
      lastError = error;
      console.error(`? Attempt ${attempt} failed:`, error.message);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Token expired or invalid. Please re-authenticate.');
          case 403:
            throw new Error('Access forbidden. Please check your permissions.');
          case 404:
            throw new Error('Data endpoint not found. Please check API URL.');
          case 429:
            console.log('Rate limited, waiting before retry...');
            await delay(RETRY_DELAY * attempt);
            continue;
          default:
            if (attempt === MAX_RETRIES) {
              throw new Error(`API Error: ${error.response.data?.message || error.response.status}`);
            }
        }
      } else if (error.code === 'ECONNABORTED') {
        if (attempt === MAX_RETRIES) {
          throw new Error('Request timeout. Please check your connection.');
        }
        await delay(RETRY_DELAY * attempt);
        continue;
      } else if (attempt === MAX_RETRIES) {
        throw new Error(`Network error: ${error.message}`);
      }
      
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * attempt);
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch orders after multiple attempts');
};

/**
 * Complete authentication and data fetch flow
 * @param {string} studentId - Your student ID
 * @param {string} password - Your password
 * @returns {Promise<{token: string, orders: Array}>}
 */
export const authenticateAndFetch = async (studentId, password) => {
  console.log('?? Starting authentication flow...');
  
  try {
    // Step 1: Get token
    const token = await getToken(studentId, password);
    console.log('?? Token acquired');
    
    // Step 2: Fetch orders
    const orders = await fetchOrders(token);
    console.log('?? Orders fetched successfully');
    
    return { token, orders };
    
  } catch (error) {
    console.error('?? Authentication flow failed:', error.message);
    throw error;
  }
};

/**
 * Validate token before using it
 * @param {string} token - JWT token to validate
 * @returns {Promise<boolean>}
 */
export const validateToken = async (token) => {
  try {
    await fetchOrders(token);
    return true;
  } catch (error) {
    return false;
  }
};

// Export all functions
export default {
  getToken,
  fetchOrders,
  authenticateAndFetch,
  validateToken
};
