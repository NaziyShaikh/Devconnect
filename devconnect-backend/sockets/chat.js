// sockets/chat.js
import Message from '../models/Message.js';

export const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('send-message', async ({ sender, recipient, content }) => {
      const message = new Message({ sender, recipient, content });
      await message.save();

      io.to(recipient).emit('receive-message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
