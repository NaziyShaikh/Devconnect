import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import API from '../api/axios';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');

const ChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const endRef = useRef();

  useEffect(() => {
    const setup = async () => {
      try {
        const u = await API.get('/auth/me');
        setCurrentUser(u.data._id);

        // Get recipient info
        const recipientData = await API.get(`/users/${userId}`);
        setRecipient(recipientData.data);

        // Get chat history
        const m = await API.get(`/messages/${userId}`);
        setMessages(m.data);
        
        socket.emit('join', u.data._id);
      } catch (error) {
        console.error('Error setting up chat:', error);
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, [userId]);

  useEffect(() => {
    socket.on('receive-message', msg => {
      console.log('📨 Received real-time message:', msg);
      setMessages(prev => {
        // Prevent duplicate messages
        if (prev.some(m => m._id === msg._id)) {
          return prev;
        }
        return [...prev, msg];
      });
    });
    return () => socket.off('receive-message');
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    const msg = { receiverId: userId, text: text };
    try {
      const response = await API.post('/messages', msg);
      setMessages(prev => [...prev, response.data]);

      // Emit message via Socket.IO for real-time delivery
      socket.emit('send-message', {
        sender: currentUser,
        recipient: userId,
        content: text
      });

      setText('');
      console.log('📤 Message sent via HTTP and Socket.IO');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center">
            {recipient?.profilePicture ? (
              <img 
                src={recipient.profilePicture} 
                alt={recipient.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {recipient?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-white">{recipient?.name || 'Chat'}</h2>
              <p className="text-sm text-blue-100">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={msg._id || i} className={`flex ${msg.senderId === currentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && send()}
              className="flex-1 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button 
              onClick={send}
              className="ml-3 bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
