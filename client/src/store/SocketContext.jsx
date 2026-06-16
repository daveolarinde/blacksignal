import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();   // ← get user directly
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('new_notification', (data) => {
      console.log('🔔 Notification received:', data);
      setNotifications((prev) => [data, ...prev].slice(0, 20));
      setUnreadCount((prev) => prev + 1);
    });

    return () => socketRef.current?.disconnect();
  }, []);

  // ← Auto-join admins room whenever user logs in as admin
  useEffect(() => {
    if (!socketRef.current || !user) return;

    if (user.role === 'admin') {
      socketRef.current.emit('join_room', { role: 'admin' });
      console.log('👑 Admin auto-joined admins room');
    }
  }, [user]); // ← runs when user changes (login/logout)

  const markAllRead = () => setUnreadCount(0);

  const joinRoom = ({ caseId, role }) => {
    socketRef.current?.emit('join_room', { caseId, role });
  };

  const sendMessage = (message) => {
    socketRef.current?.emit('send_message', message);
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      notifications,
      unreadCount,
      markAllRead,
      joinRoom,
      sendMessage
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);