import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Chat from './Chat';

const ChatWrapper = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipientName, setRecipientName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!recipientId) {
      // If no recipientId, show chat list
      fetchChatList();
    } else {
      // If recipientId exists, show specific chat
      fetchRecipientName();
    }
  }, [recipientId]);

  const fetchChatList = async () => {
    try {
      setLoading(true);
      console.log('Fetching chat list for user:', user._id);

      // Get all messages for current user to build chat list
      const response = await axios.get('/api/messages/user/rooms');
      const rooms = response.data.data;
      console.log('Found rooms:', rooms);

      // Get details for each chat room
      const chatPromises = rooms.map(async (roomId) => {
        try {
          console.log('Processing room:', roomId);

          // Get last message from this room
          const messagesRes = await axios.get(`/api/messages/room/${roomId}`);
          const messages = messagesRes.data.data;
          const lastMessage = messages[messages.length - 1];

          // Determine other participant
          const participants = roomId.split('-');
          const otherUserId = participants.find(id => id !== user._id);
          console.log('Other user ID:', otherUserId);

          if (!otherUserId) return null;

          // Get other user's details
          const userRes = await axios.get(`/api/users/${otherUserId}`);
          const otherUser = userRes.data.data;

          const chatData = {
            roomId,
            otherUser,
            lastMessage,
            unreadCount: messages.filter(msg =>
              msg.sender._id !== user._id && !msg.read
            ).length
          };

          console.log('Chat data:', chatData);
          return chatData;
        } catch (error) {
          console.error('Error fetching chat details for room', roomId, ':', error);
          return null;
        }
      });

      const chats = (await Promise.all(chatPromises)).filter(chat => chat !== null);
      console.log('Final chat list:', chats);
      setChatList(chats);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    navigate(`/chat/${chat.otherUser._id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // If no recipientId, show chat list
  if (!recipientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
            {/* Chat List Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                    💬 My Chats
                  </h3>
                  <p className="text-blue-100 text-sm">Manage your conversations</p>
                </div>
                <div className="text-white text-right">
                  <div className="text-2xl font-bold">{chatList.length}</div>
                  <div className="text-sm">Active chats</div>
                </div>
              </div>
            </div>

            {/* Chat List */}
            <div className="max-h-96 overflow-y-auto">
              {chatList.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h4>
                  <p className="text-gray-600">Start chatting with developers to see your conversations here</p>
                </div>
              ) : (
                chatList.map((chat) => (
                  <div
                    key={chat.roomId}
                    onClick={() => handleChatSelect(chat)}
                    className="flex items-center p-6 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-200 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      {chat.otherUser.profile?.avatar ? (
                        <img
                          src={chat.otherUser.profile.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-white text-lg font-bold">
                          {chat.otherUser.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {chat.otherUser.name}
                        </h4>
                        {chat.lastMessage && (
                          <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                            {new Date(chat.lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage.sender._id === user._id ? 'You: ' : ''}
                          {chat.lastMessage.message}
                        </p>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="ml-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If recipientId exists, show specific chat
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Chat recipientId={recipientId} recipientName={recipientName} />
    </div>
  );
};

export default ChatWrapper;
