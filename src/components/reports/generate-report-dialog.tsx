'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Loader2 } from 'lucide-react';
import { useGenerateReport, useReportStatus } from '@/lib/query/reports';
import type { ReportType } from '@/types/reports';

interface GenerateReportDialogProps {
  trigger?: React.ReactNode;
}

export function GenerateReportDialog({ trigger }: GenerateReportDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [reportType, setReportType] = React.useState<ReportType>('daily');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [jobId, setJobId] = React.useState<string | null>(null);

  const { mutate: generateReport, isPending } = useGenerateReport();
  const { data: jobStatus } = useReportStatus(jobId);

  const handleGenerate = () => {
    generateReport(
      {
        reportType,
        dateRange: dateRange
          ? {
              start: dateRange.from!,
              end: dateRange.to!,
            }
          : undefined,
      },
      {
        onSuccess: (jobId) => {
          setJobId(jobId);
        },
      }
    );
  };

  // Close dialog when job is completed
  React.useEffect(() => {
    if (jobStatus?.state === 'completed') {
      setTimeout(() => {
        setOpen(false);
        setJobId(null);
      }, 2000);
    }
  }, [jobStatus?.state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Generate Report</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Generate a custom report for your predictions
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="report-type">Report Type</label>
            <Select
              value={reportType}
              onValueChange={(value: ReportType) => setReportType(value)}
            >
              <SelectTrigger id="report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Report</SelectItem>
                <SelectItem value="weekly">Weekly Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label>Date Range (Optional)</label>
            <div className="rounded-md border">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          {jobStatus?.state === 'completed' ? (
            <Button className="w-full" variant="outline" disabled>
              Report Sent!
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isPending || jobStatus?.state === 'active'}
              className="w-full"
            >
              {(isPending || jobStatus?.state === 'active') && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {jobStatus?.state === 'active'
                ? 'Generating...'
                : 'Generate Report'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}