import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { logger } from '@/lib/logging/logger';

interface ErrorMonitorProps {
  className?: string;
}

export function ErrorMonitor({ className = '' }: ErrorMonitorProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('error');

  useEffect(() => {
    const fetchLogs = () => {
      const recentLogs = logger.getLogsByLevel(selectedLevel as any);
      setLogs(recentLogs);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [selectedLevel]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getLevelClass = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warn':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Error Monitor</CardTitle>
          <div className="flex space-x-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="error">Errors</option>
              <option value="warn">Warnings</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${getLevelClass(log.level)}`}
            >
              <div className="flex items-start space-x-3">
                {getLevelIcon(log.level)}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{log.message}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  {log.error && (
                    <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                      {log.error.stack}
                    </pre>
                  )}

                  {log.context && (
                    <details className="text-sm">
                      <summary className="cursor-pointer hover:text-gray-700">
                        Context
                      </summary>
                      <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.context, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No {selectedLevel} logs found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
