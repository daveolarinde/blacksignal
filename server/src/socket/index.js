import { Server } from 'socket.io';

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
     origin: process.env.CLIENT_URL || 'http://localhost:5173', // ← add fallback
  credentials: true,
      methods: ['GET', 'POST'],
      
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('join_room', ({ caseId, role }) => {
      // Always join admins room if admin, regardless of caseId
      if (role === 'admin') {
        socket.join('admins');
        console.log(`👥 admin joined admins room`);
      }
      if (caseId) {
        socket.join(`case:${caseId}`);
        console.log(`👥 ${role} joined case:${caseId}`);
      }
    });

    socket.on('send_message', (message) => {
      console.log('📨 send_message received, senderRole:', message.senderRole);

      if (!message.caseId) return;

      // Always deliver the message to the case room
      socket.to(`case:${message.caseId}`).emit('receive_message', message);

      const isAdmin = message.senderRole === 'admin' || message.sender?.role === 'admin';

      if (!isAdmin) {
        // Client sent → notify ALL admins
        console.log('📢 notifying admins room...');
        io.to('admins').emit('new_notification', {
          type: 'new_message',
          caseId: message.caseId,
          senderName: message.senderName || message.sender?.name || 'Client',
          preview: (message.content || '').slice(0, 60),
          timestamp: new Date()
        });
      } else {
        // Admin sent → notify client in that case room
        console.log('📢 notifying client in case:', message.caseId);
        io.to(`case:${message.caseId}`).emit('new_notification', {
          type: 'new_message',
          caseId: message.caseId,
          senderName: message.senderName || 'Support Team',
          preview: (message.content || '').slice(0, 60),
          timestamp: new Date()
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  return io;
}