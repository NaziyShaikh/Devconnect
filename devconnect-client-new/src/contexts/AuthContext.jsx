import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      console.log('🔍 Fetching current user...');
      const res = await API.get('/auth/me', { withCredentials: true }); // Ensure cookies are sent
      console.log('✅ Current user fetched successfully:', res.data);
      console.log('   User ID:', res.data._id);
      console.log('   User name:', res.data.name);
      console.log('   User role:', res.data.role);
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error('❌ Error fetching current user:', error);
      console.error('   Error response:', error.response);
      console.error('   Error status:', error.response?.status);
      console.error('   Error data:', error.response?.data);
      console.error('   Error config:', error.config);

      setUser(null);

      // Handle different types of auth errors
      if (error.response?.status === 401) {
        console.log('   401 Unauthorized - Token invalid or expired');
        // Try to clear any invalid cookies
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } else if (error.response?.status === 403) {
        console.log('   403 Forbidden - Access denied');
      } else if (error.response?.status >= 500) {
        console.log('   Server error - Backend might be down');
      } else if (error.response?.status === 404) {
        console.log('   404 Not Found - API endpoint not available');
      } else {
        console.log('   Other error - Network or client issue');
      }

      // Don't throw error for 401/404 as these are expected when not logged in
      if (error.response?.status === 401 || error.response?.status === 404) {
        return null;
      }

      throw error; // Re-throw for other errors
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Clear token from sessionStorage
      sessionStorage.removeItem('token');
      // Clear token cookie
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('🚪 User logged out, cleared all tokens');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
