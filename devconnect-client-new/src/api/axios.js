import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // This is crucial for cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default API;
