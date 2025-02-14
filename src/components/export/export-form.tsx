import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface ExportFormProps {
  onExport: (format: 'pdf' | 'csv', options: any) => Promise<void>;
}

export function ExportForm({ onExport }: ExportFormProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [includeAnalytics, setIncludeAnalytics] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      setIsLoading(true);
      await onExport(format, {
        dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
        includeAnalytics
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Export Predictions</h3>
      
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {startDate ? format(startDate, 'PP') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {endDate ? format(endDate, 'PP') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="analytics"
          checked={includeAnalytics}
          onCheckedChange={(checked) => setIncludeAnalytics(checked as boolean)}
        />
        <label htmlFor="analytics">Include Analytics</label>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => handleExport('pdf')}
          disabled={isLoading}
        >
          Export as PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport('csv')}
          disabled={isLoading}
        >
          Export as CSV
        </Button>
      </div>
    </div>
  );
}
