import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  retry 
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        {message}
        {retry && (
          <button
            onClick={retry}
            className="text-sm underline hover:no-underline"
          >
            Try again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}