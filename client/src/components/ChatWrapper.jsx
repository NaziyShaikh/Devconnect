import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chat from './Chat';

const ChatWrapper = () => {
  const { recipientId } = useParams();
  const [recipientName, setRecipientName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipientName = async () => {
      try {
        const response = await axios.get(`/api/users/${recipientId}`);
        setRecipientName(response.data.data.name);
      } catch (error) {
        console.error('Error fetching recipient name:', error);
      } finally {
        setLoading(false);
      }
    };

    if (recipientId) {
      fetchRecipientName();
    }
  }, [recipientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Chat recipientId={recipientId} recipientName={recipientName} />
    </div>
  );
};

export default ChatWrapper;
