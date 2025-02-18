import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Database, BarChart } from 'lucide-react';

interface ModelStatusProps {
  metadata: {
    version: string;
    createdAt: string;
    lastUpdated: string;
    metrics?: {
      accuracy: number;
      f1Score: number;
    };
  } | null;
  className?: string;
}

export function ModelStatus({ metadata, className = '' }: ModelStatusProps) {
  if (!metadata) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Model Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Badge variant="secondary">No model trained</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Model Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Version</span>
            </div>
            <span className="font-medium">{metadata.version}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Last Updated</span>
            </div>
            <span className="font-medium">
              {new Date(metadata.lastUpdated).toLocaleDateString()}
            </span>
          </div>

          {metadata.metrics && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Accuracy</span>
              </div>
              <span className="font-medium">
                {metadata.metrics.accuracy.toFixed(1)}%
              </span>
            </div>
          )}

          <div className="pt-4">
            <Badge 
              variant={metadata.metrics ? 'success' : 'warning'}
              className="w-full justify-center"
            >
              {metadata.metrics ? 'Model Ready' : 'Needs Training'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
