import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequestLogs } from '@/middleware/logging';
import { Clock, AlertCircle, Search } from 'lucide-react';

interface RequestMonitorProps {
  className?: string;
}

export function RequestMonitor({ className = '' }: RequestMonitorProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<'time' | 'duration'>('time');

  useEffect(() => {
    const fetchLogs = () => {
      const allLogs = getRequestLogs(100);
      
      // Apply filters
      let filteredLogs = allLogs;
      if (filter) {
        filteredLogs = allLogs.filter(log =>
          log.path.toLowerCase().includes(filter.toLowerCase()) ||
          log.method.toLowerCase().includes(filter.toLowerCase())
        );
      }

      // Apply sorting
      filteredLogs.sort((a, b) => {
        if (sort === 'time') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        return (b.duration || 0) - (a.duration || 0);
      });

      setLogs(filteredLogs);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [filter, sort]);

  const getStatusColor = (status?: number) => {
    if (!status) return 'text-gray-500';
    if (status >= 500) return 'text-red-500';
    if (status >= 400) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Requests</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Filter requests..."
                className="pl-8 pr-4 py-2 text-sm border rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'time' | 'duration')}
              className="text-sm border rounded-md px-2 py-2"
            >
              <option value="time">Sort by Time</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div 
              key={log.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm">{log.method}</span>
                  <span className="font-medium">{log.path}</span>
                </div>
                <div className="flex items-center space-x-4">
                  {log.error && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{log.duration}ms</span>
                  </div>
                </div>
              </div>

              {log.error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  {log.error.message}
                </div>
              )}

              <div className="mt-1 text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No requests found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
