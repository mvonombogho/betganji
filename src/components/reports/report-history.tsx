'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileDown, FileClock, FileX } from 'lucide-react';
import { useReportHistory } from '@/lib/query/reports';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function StatusBadge({ status, error }: { status: string; error?: string }) {
  switch (status) {
    case 'SENT':
      return <Badge variant="success">Sent</Badge>;
    case 'QUEUED':
      return <Badge variant="secondary">Queued</Badge>;
    case 'FAILED':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="destructive">Failed</Badge>
            </TooltipTrigger>
            <TooltipContent>{error || 'Unknown error'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function ReportHistory() {
  const { data: history, isLoading } = useReportHistory();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!history?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileClock className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Reports Yet</h3>
        <p className="text-sm text-muted-foreground">
          Your report history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.createdAt), 'PPp')}
              </TableCell>
              <TableCell>
                <span className="capitalize">
                  {log.metadata?.reportType || 'Custom'} Report
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={log.status} error={log.error} />
              </TableCell>
              <TableCell className="text-right">
                {log.status === 'SENT' && log.metadata?.reportUrl ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(log.metadata.reportUrl)}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download Report</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : log.status === 'FAILED' ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement retry functionality
                            console.log('Retry report generation:', log.id);
                          }}
                        >
                          <FileX className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Retry Generation</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}