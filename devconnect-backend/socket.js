import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import User from './models/User.js';

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    socket.join(userId);

    socket.on('send-message', async ({ to, text }) => {
      const message = await Message.create({
        sender: userId,
        recipient: to,
        text
      });

      io.to(to).emit('receive-message', {
        sender: userId,
        text,
        timestamp: message.timestamp
      });
    });
  });
}
