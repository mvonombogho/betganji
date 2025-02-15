import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReportPreferences, ReportType, JobStatus, EmailLog } from '@/types/reports';
import { toast } from '@/components/ui/use-toast';

// Fetch report preferences
export function useReportPreferences() {
  return useQuery({
    queryKey: ['reportPreferences'],
    queryFn: async () => {
      const response = await fetch('/api/reports/preferences');
      if (!response.ok) throw new Error('Failed to fetch report preferences');
      return response.json() as Promise<ReportPreferences>;
    },
  });
}

// Update report preferences
export function useUpdateReportPreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (preferences: ReportPreferences) => {
      const response = await fetch('/api/reports/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) throw new Error('Failed to update report preferences');
      return response.json() as Promise<ReportPreferences>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['reportPreferences'], data);
      toast({
        title: 'Preferences Updated',
        description: 'Your report preferences have been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update preferences',
        variant: 'destructive',
      });
    },
  });
}

// Generate a report
export function useGenerateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reportType,
      dateRange,
    }: {
      reportType: ReportType;
      dateRange?: { start: Date; end: Date };
    }) => {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, dateRange }),
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json() as Promise<{ jobId: string }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reportHistory'] });
      toast({
        title: 'Report Generation Started',
        description: 'Your report will be emailed to you when ready.',
      });
      return data.jobId;
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate report',
        variant: 'destructive',
      });
    },
  });
}

// Check report status
export function useReportStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['reportStatus', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const response = await fetch(`/api/reports/status/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch report status');
      return response.json() as Promise<JobStatus>;
    },
    enabled: !!jobId,
    refetchInterval: (data) => {
      if (!data || data.state === 'completed' || data.state === 'failed') {
        return false;
      }
      return 5000; // Poll every 5 seconds for active jobs
    },
  });
}

// Get report history
export function useReportHistory() {
  return useQuery({
    queryKey: ['reportHistory'],
    queryFn: async () => {
      const response = await fetch('/api/reports/generate');
      if (!response.ok) throw new Error('Failed to fetch report history');
      return response.json() as Promise<EmailLog[]>;
    },
  });
}