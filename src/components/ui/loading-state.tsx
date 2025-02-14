import React from 'react';
import { LoadingSpinner } from './loading-spinner';
import { ErrorMessage } from './error-message';

interface LoadingStateProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  retry?: () => void;
  loadingMessage?: string;
  className?: string;
}

export function LoadingState({
  loading,
  error,
  children,
  retry,
  loadingMessage = 'Loading...',
  className = ''
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <LoadingSpinner />
        <p className="mt-4 text-sm text-muted-foreground">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <ErrorMessage
          message={error.message}
          retry={retry}
        />
      </div>
    );
  }

  return <>{children}</>;
}