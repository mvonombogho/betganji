import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={cn(
          "animate-spin rounded-full border-t-transparent", 
          sizeClass[size],
          "border-primary",
          className
        )} 
      />
    </div>
  );
}
