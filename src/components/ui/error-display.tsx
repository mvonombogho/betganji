import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, XCircle, Info } from 'lucide-react';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  severity?: ErrorSeverity;
  retry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  severity = 'error',
  retry
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getDefaultTitle = () => {
    switch (severity) {
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      default:
        return 'Error';
    }
  };

  return (
    <Alert variant={severity === 'error' ? 'destructive' : 'default'}
           className="mb-4">
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <AlertTitle>{title || getDefaultTitle()}</AlertTitle>
          <AlertDescription className="mt-1">
            {message}
          </AlertDescription>
          {retry && (
            <button
              onClick={retry}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default ErrorDisplay;