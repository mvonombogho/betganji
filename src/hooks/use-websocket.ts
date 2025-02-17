import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type MessageHandler = (data: any) => void;

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const router = useRouter();
  const handlers = useRef<Map<string, Set<MessageHandler>>>(new Map());

  const connect = useCallback(() => {
    // Use secure WebSocket in production
    const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const host = window.location.host;
    ws.current = new WebSocket(`${protocol}://${host}/ws`);

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const typeHandlers = handlers.current.get(message.type);
        if (typeHandlers) {
          typeHandlers.forEach(handler => handler(message.payload));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.current.onclose = () => {
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  const subscribe = useCallback((type: string, handler: MessageHandler) => {
    if (!handlers.current.has(type)) {
      handlers.current.set(type, new Set());
    }
    handlers.current.get(type)?.add(handler);

    return () => {
      handlers.current.get(type)?.delete(handler);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const onMatchUpdate = useCallback((handler: MessageHandler) => {
    return subscribe('MATCH_UPDATE', handler);
  }, [subscribe]);

  const onOddsUpdate = useCallback((handler: MessageHandler) => {
    return subscribe('ODDS_UPDATE', handler);
  }, [subscribe]);

  return {
    onMatchUpdate,
    onOddsUpdate,
  };
}
