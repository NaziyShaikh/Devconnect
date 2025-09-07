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
      setUser(res.data);
    } catch (error) {
      console.error('❌ Error fetching current user:', error);
      console.error('   Error response:', error.response);
      console.error('   Error status:', error.response?.status);
      console.error('   Error data:', error.response?.data);

      setUser(null);

      // Handle different types of auth errors
      if (error.response?.status === 401) {
        console.log('   401 Unauthorized - Token invalid or expired');
        // No need to clear localStorage since we're using cookies
        // The server should handle clearing the invalid cookie
      } else if (error.response?.status === 403) {
        console.log('   403 Forbidden - Access denied');
      } else if (error.response?.status >= 500) {
        console.log('   Server error - Backend might be down');
      } else {
        console.log('   Other error - Network or client issue');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
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
