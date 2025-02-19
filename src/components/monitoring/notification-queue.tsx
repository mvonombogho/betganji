import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QueuedNotification {
  id: string;
  type: string;
  userId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
  scheduledFor: string;
  processedAt?: string;
  error?: string;
  retryCount: number;
  user: {
    email: string;
  };
}

interface NotificationQueueProps {
  notifications: QueuedNotification[];
  className?: string;
}

export function NotificationQueue({ 
  notifications,
  className = '' 
}: NotificationQueueProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'RETRYING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Notification Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{notification.type}</div>
                <Badge className={getStatusColor(notification.status)}>
                  {notification.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span>{notification.user.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span>{new Date(notification.scheduledFor).toLocaleString()}</span>
                </div>

                {notification.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed:</span>
                    <span>{new Date(notification.processedAt).toLocaleString()}</span>
                  </div>
                )}

                {notification.retryCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retry Count:</span>
                    <span>{notification.retryCount}</span>
                  </div>
                )}

                {notification.error && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-red-600 text-xs">
                    {notification.error}
                  </div>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No notifications in queue
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
