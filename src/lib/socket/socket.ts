import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

export const subscribeToMatch = (matchId: string) => {
  const socket = getSocket();
  socket.emit('subscribe:match', matchId);
};

export const unsubscribeFromMatch = (matchId: string) => {
  const socket = getSocket();
  socket.emit('unsubscribe:match', matchId);
};

export const subscribeToOdds = (matchId: string) => {
  const socket = getSocket();
  socket.emit('subscribe:odds', matchId);
};

export const unsubscribeFromOdds = (matchId: string) => {
  const socket = getSocket();
  socket.emit('unsubscribe:odds', matchId);
};