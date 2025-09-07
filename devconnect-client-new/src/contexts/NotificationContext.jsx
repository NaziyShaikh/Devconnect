import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [popupNotifications, setPopupNotifications] = useState([]);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
      console.log('Notifications fetched:', res.data.length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      // Don't set notifications if unauthorized - user might not be logged in
      setNotifications([]);
    }
  };

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, []);

  const dismissPopupNotification = useCallback((id) => {
    setPopupNotifications(prev => prev.filter(popup => popup.id !== id));
  }, []);

  const showPopupNotification = useCallback((notification) => {
    const popupId = Date.now() + Math.random();
    const popup = {
      id: popupId,
      ...notification,
      timestamp: new Date()
    };

    setPopupNotifications(prev => [...prev, popup]);
  }, []);

  useEffect(() => {
    // Fetch notifications when user logs in or changes
    if (user) {
      console.log('User logged in, fetching notifications...');
      fetchNotifications();

      // Join user's notification room for real-time updates
      socket.emit('join', user._id);
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setPopupNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    // Listen for real-time notification updates
    socket.on('notification', (newNotification) => {
      console.log('🔔 Real-time notification received:', newNotification);

      // Add to regular notifications list
      setNotifications(prev => [newNotification, ...prev]);

      // Show popup notification
      showPopupNotification(newNotification);
    });

    return () => {
      socket.off('notification');
    };
  }, [showPopupNotification]);

  const markAsRead = async id => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch('/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      popupNotifications,
      markAsRead,
      markAllAsRead,
      fetchNotifications,
      dismissPopupNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
