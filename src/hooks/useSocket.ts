import { useEffect, useCallback } from 'react';
import { initializeSocket, getSocket } from '@/lib/socket/socket';
import type { SocketEvent } from '@/lib/socket/events';

export const useSocket = () => {
  useEffect(() => {
    const socket = initializeSocket();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribe = useCallback((event: SocketEvent, handler: (data: any) => void) => {
    const socket = getSocket();
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, []);

  return { subscribe };
};