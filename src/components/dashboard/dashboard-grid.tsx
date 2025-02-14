import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';

interface DashboardGridProps {
  layouts: {
    id: string;
    title: string;
    width: 'full' | 'half' | 'third';
    height: 'small' | 'medium' | 'large';
    visible: boolean;
    component: React.ReactNode;
  }[];
  loading?: boolean;
  onLayoutChange?: (layouts: any[]) => void;
}

export function DashboardGrid({ layouts, loading, onLayoutChange }: DashboardGridProps) {
  const getWidthClass = (width: string) => {
    switch (width) {
      case 'full': return 'col-span-12';
      case 'half': return 'col-span-12 md:col-span-6';
      case 'third': return 'col-span-12 md:col-span-4';
      default: return 'col-span-12';
    }
  };

  const getHeightClass = (height: string) => {
    switch (height) {
      case 'small': return 'h-64';
      case 'medium': return 'h-96';
      case 'large': return 'h-128';
      default: return 'h-64';
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <LoadingState loading={loading} loadingMessage="Loading dashboard...">
        {layouts
          .filter(layout => layout.visible)
          .map(layout => (
            <Card 
              key={layout.id}
              className={`${getWidthClass(layout.width)} ${getHeightClass(layout.height)}`}
            >
              <CardHeader>
                <CardTitle>{layout.title}</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)] overflow-auto">
                {layout.component}
              </CardContent>
            </Card>
          ))}
      </LoadingState>
    </div>
  );
}