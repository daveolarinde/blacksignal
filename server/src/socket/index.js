// socket.js
import { Server } from 'socket.io';

export function initSocket(server) {
  const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

  io.on('connection', (socket) => {
    // Client joins a room keyed to caseId
    socket.on('join_room', ({ caseId, role }) => {
      if (caseId) socket.join(`case:${caseId}`);
      if (role === 'admin') socket.join('admins');
    });

    socket.on('send_message', (message) => {
      // Broadcast to everyone in that case room (user + any admin watching)
      if (message.caseId) {
        socket.to(`case:${message.caseId}`).emit('receive_message', message);
        socket.to('admins').emit('receive_message', message);
      }
    });
  });

  return io;
}