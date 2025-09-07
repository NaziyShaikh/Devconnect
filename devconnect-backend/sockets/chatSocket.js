const Chat = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 New client connected');

    // Join room based on user ID
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Handle message sending
    socket.on('sendMessage', async ({ sender, receiver, message }) => {
      const chat = new Chat({ sender, receiver, message });
      await chat.save();

      io.to(receiver).emit('receiveMessage', {
        sender,
        message,
        createdAt: chat.createdAt
      });
    });

    // Handle join request notifications
    socket.on('joinRequest', ({ userId }) => {
      io.to(userId).emit('notification', {
        type: 'join_request',
        message: 'New join request received'
      });
    });

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected');
    });
  });
};
