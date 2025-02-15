export interface ReportPreferences {
  id?: string;
  userId?: string;
  dailyReports: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  emailTime: string;
  timezone: string;
  lastSent?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmailLog {
  id: string;
  userId: string;
  type: string;
  status: 'QUEUED' | 'SENT' | 'FAILED';
  error?: string;
  metadata?: {
    reportType?: 'daily' | 'weekly' | 'monthly';
    jobId?: string;
    reportUrl?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  createdAt: Date;
}

export interface JobStatus {
  id: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  data: {
    userId: string;
    reportType: 'daily' | 'weekly' | 'monthly';
  };
  progress: number;
  failedReason?: string;
  timestamp: number;
  processedOn?: number;
  finishedOn?: number;
  log?: {
    status: 'QUEUED' | 'SENT' | 'FAILED';
    error?: string;
    createdAt: Date;
  };
}

export type ReportType = 'daily' | 'weekly' | 'monthly';