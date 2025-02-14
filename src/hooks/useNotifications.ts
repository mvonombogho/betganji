import { useState, useEffect } from 'react';
import { NotificationService } from '@/lib/notifications/service';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const supported = 'Notification' in window;
    setSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!supported) return false;

    const notificationService = NotificationService.getInstance();
    const granted = await notificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  };

  return {
    supported,
    permission,
    requestPermission,
    notificationService: NotificationService.getInstance()
  };
};