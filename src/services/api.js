import axios from 'axios';

const BASE_URL = 'https://t4e-testserver.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
});

let authToken = localStorage.getItem('authToken');
let dataEndpoint = localStorage.getItem('dataEndpoint') || '/private/data';

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const getToken = async (studentId, password, set = 'setA') => {
  try {
    console.log('Attempting to get token with:', { studentId, set });
    const response = await axios.post(`${BASE_URL}/public/token`, {
      studentId,
      password,
      set,
    });
    authToken = response.data.token;
    dataEndpoint = response.data.dataUrl;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('dataEndpoint', dataEndpoint);
    console.log('Token obtained successfully');
    console.log('Data URL:', response.data.dataUrl);
    return response.data;
  } catch (error) {
    console.error('Token fetch failed:', error.response?.data || error.message);
    console.error('Full error:', error);
    throw error;
  }
};

export const getDataset = async () => {
  try {
    console.log('Fetching dataset from:', dataEndpoint);
    const response = await api.get(dataEndpoint);
    console.log('Dataset fetched successfully');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Dataset fetch failed:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
