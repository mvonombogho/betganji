import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Server, Database, Brain, Signal } from 'lucide-react';

interface SystemHealthProps {
  className?: string;
}

export function SystemHealth({ className = '' }: SystemHealthProps) {
  // These would be fetched from actual monitoring endpoints
  const systemStatus = {
    server: {
      status: 'healthy',
      uptime: '99.9%',
      lastIssue: null
    },
    database: {
      status: 'healthy',
      connectionPool: '20/50',
      queryLatency: '45ms'
    },
    ml: {
      status: 'healthy',
      modelVersion: '1.0.3',
      lastTraining: '2024-02-17'
    },
    claude: {
      status: 'healthy',
      responseTime: '850ms',
      successRate: '99.2%'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const StatusIndicator = ({ status }: { status: string }) => (
    <div className="flex items-center space-x-2">
      <div className={`h-2 w-2 rounded-full ${getStatusColor(status)} bg-current`} />
      <span className="capitalize">{status}</span>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Server Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Server className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Server</h3>
              <StatusIndicator status={systemStatus.server.status} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{systemStatus.server.uptime}</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Database className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Database</h3>
              <StatusIndicator status={systemStatus.database.status} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{systemStatus.database.queryLatency}</div>
              <div className="text-sm text-gray-500">Avg Latency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ML System Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Brain className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">ML System</h3>
              <StatusIndicator status={systemStatus.ml.status} />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{systemStatus.ml.modelVersion}</div>
              <div className="text-sm text-gray-500">Model Version</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claude API Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Signal className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">Claude API</h3>
              <StatusIndicator status={systemStatus.claude.status} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{systemStatus.claude.successRate}</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
