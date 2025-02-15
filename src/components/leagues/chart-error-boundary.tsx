import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ChartErrorBoundaryProps {
  error: Error | unknown;
  onRetry?: () => void;
  title?: string;
}

const ChartErrorBoundary: React.FC<ChartErrorBoundaryProps> = ({
  error,
  onRetry,
  title = 'Unable to load chart data'
}) => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

  return (
    <Alert variant="destructive" className="h-full flex flex-col justify-center">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="mb-2">{title}</AlertTitle>
      <AlertDescription className="mb-4 text-sm text-muted-foreground">
        {errorMessage}
      </AlertDescription>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="w-full mt-2"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </Alert>
  );
};

export default ChartErrorBoundary;