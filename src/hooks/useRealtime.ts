import { useEffect, useCallback } from 'react';
import { realtimeService } from '@/lib/services/realtime-service';

type MessageHandler = (data: any) => void;

export const useRealtime = (type: string, handler: MessageHandler) => {
  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    // Connect to WebSocket when the hook is first used
    realtimeService.connect();

    // Subscribe to the specified message type
    const unsubscribe = realtimeService.subscribe(type, stableHandler);

    // Cleanup subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [type, stableHandler]);

  const publish = useCallback(
    (data: any) => {
      realtimeService.publish(type, data);
    },
    [type]
  );

  return { publish };
};
