import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <Card className={`bg-red-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionErrorProps {
  message: string;
}

export function SectionError({ message }: SectionErrorProps) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <div className="flex items-center space-x-2 text-sm">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  );
}
