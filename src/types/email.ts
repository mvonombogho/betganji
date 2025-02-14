export interface EmailTemplate {
  subject: string;
  message: string;
  recipientName?: string;
}

export interface EmailReportOptions {
  email: string;
  format: 'excel' | 'csv';
  template: EmailTemplate;
  includeOverview?: boolean;
  includeBookmakers?: boolean;
  includeMonthly?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ScheduledReport {
  id: string;
  userId: string;
  email: string;
  format: 'excel' | 'csv';
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  template: EmailTemplate;
  options: {
    includeOverview: boolean;
    includeBookmakers: boolean;
    includeMonthly: boolean;
  };
  lastSent?: Date;
  nextScheduled: Date;
  createdAt: Date;
  updatedAt: Date;
}