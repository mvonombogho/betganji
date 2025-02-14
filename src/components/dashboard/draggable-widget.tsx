import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface DraggableWidgetProps {
  id: string;
  index: number;
  title: string;
  width: string;
  height: string;
  children: React.ReactNode;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
}

export function DraggableWidget({
  id,
  index,
  title,
  width,
  height,
  children,
  moveWidget
}: DraggableWidgetProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'WIDGET',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'WIDGET',
    hover(item: { id: string; index: number }) {
      if (item.index === index) return;
      moveWidget(item.index, index);
      item.index = index;
    }
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`${width} ${height}`}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-x-2">
          <CardTitle className="flex-1">{title}</CardTitle>
          <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}