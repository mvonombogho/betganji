import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LoadingState } from '@/components/ui/loading-state';
import { DraggableWidget } from './draggable-widget';

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

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!onLayoutChange) return;

    const visibleLayouts = layouts.filter(layout => layout.visible);
    const dragWidget = visibleLayouts[dragIndex];
    
    const newLayouts = [...layouts];
    const visibleIndices = layouts.reduce((acc: number[], layout, index) => {
      if (layout.visible) acc.push(index);
      return acc;
    }, []);

    const actualDragIndex = visibleIndices[dragIndex];
    const actualHoverIndex = visibleIndices[hoverIndex];

    newLayouts.splice(actualDragIndex, 1);
    newLayouts.splice(actualHoverIndex, 0, dragWidget);

    onLayoutChange(newLayouts);
  }, [layouts, onLayoutChange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4">
        <LoadingState loading={loading} loadingMessage="Loading dashboard...">
          {layouts
            .filter(layout => layout.visible)
            .map((layout, index) => (
              <DraggableWidget
                key={layout.id}
                id={layout.id}
                index={index}
                title={layout.title}
                width={getWidthClass(layout.width)}
                height={getHeightClass(layout.height)}
                moveWidget={moveWidget}
              >
                {layout.component}
              </DraggableWidget>
            ))}
        </LoadingState>
      </div>
    </DndProvider>
  );
}