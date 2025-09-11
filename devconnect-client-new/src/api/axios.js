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

// Add request interceptor to log outgoing requests and add Authorization header
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage as backup
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added Authorization header from localStorage');
    }

    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      hasAuthHeader: !!config.headers.Authorization,
      hasTokenCookie: !!document.cookie.includes('token')
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and token refresh
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.msg || error.message,
      data: error.response?.data
    });

    // If 401 error and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Attempting token refresh due to 401 error');
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await API.post('/auth/refresh-token');
        const newToken = refreshResponse.data.token;

        // Store new token in localStorage
        localStorage.setItem('token', newToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        console.log('✅ Token refreshed, retrying original request');
        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Clear invalid tokens
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Redirect to login or handle logout
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
