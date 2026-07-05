import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppState } from './StateContext';
import { NOTIFICATION_SERVICE_URL } from '../constants/apiConstants';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAppState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect if user is logged in
    if (!currentUser || !currentUser.token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to notification-service (adjust URL to match where notification-service is running)
    const newSocket = io(NOTIFICATION_SERVICE_URL || 'http://localhost:4500', {
      auth: { token: currentUser.token },
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to Notification Service:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    setSocket(newSocket);

    // Cleanup on unmount or logout
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?.token]); // Re-connect if token changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
