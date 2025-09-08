import axios from 'axios';

// Determine the correct API URL based on environment
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // For production, use the deployed backend URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://devconnect-oczl.onrender.com/api';
  }

  // For development
  return 'http://localhost:5001/api';
};

const API = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true, // This is crucial for cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to log outgoing requests
API.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.msg || error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default API;
