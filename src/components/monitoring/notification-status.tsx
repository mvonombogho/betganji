import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface NotificationStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  retrying: number;
}

interface NotificationStatusProps {
  stats: NotificationStats;
  className?: string;
}

export function NotificationStatus({ stats, className = '' }: NotificationStatusProps) {
  const getSuccessRate = () => {
    if (stats.completed === 0) return 0;
    return ((stats.completed / stats.total) * 100).toFixed(1);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Notification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Notifications */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <div className="text-sm text-gray-600">Total Notifications</div>
          </div>

          {/* Success Rate */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                {getSuccessRate()}%
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Success Rate ({stats.completed} completed)
            </div>
          </div>

          {/* Pending */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">
                {stats.pending}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Pending
              {stats.retrying > 0 && (
                <span className="text-xs ml-1">
                  ({stats.retrying} retrying)
                </span>
              )}
            </div>
          </div>

          {/* Failed */}
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold text-red-600">
                {stats.failed}
              </span>
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
