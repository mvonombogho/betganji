import Queue from 'bull';
import { Redis } from 'ioredis';
import { EmailService } from '@/lib/services/email-service';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

const redisClient = new Redis(process.env.REDIS_URL);
const emailService = new EmailService();

// Create queues
export const reportQueue = new Queue('prediction-reports', {
  redis: redisClient as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

// Define job processors
reportQueue.process(async (job) => {
  const { userId, reportType } = job.data;
  let dateRange;

  const now = new Date();

  switch (reportType) {
    case 'daily':
      dateRange = {
        start: startOfDay(now),
        end: endOfDay(now),
      };
      break;
    case 'weekly':
      dateRange = {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };
      break;
    case 'monthly':
      dateRange = {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
      break;
    default:
      throw new Error(`Invalid report type: ${reportType}`);
  }

  await emailService.sendPredictionReport(userId, dateRange, reportType);
});

// Error handling
reportQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

reportQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

// Schedule constants
export const REPORT_SCHEDULES = {
  DAILY: '0 0 * * *', // Every day at midnight
  WEEKLY: '0 0 * * 0', // Every Sunday at midnight
  MONTHLY: '0 0 1 * *', // First day of every month at midnight
} as const;

// Helper functions to schedule reports
export async function scheduleReport(
  userId: string,
  reportType: 'daily' | 'weekly' | 'monthly',
  schedule: string
) {
  // Remove any existing scheduled reports for this user and type
  const existingJobs = await reportQueue.getRepeatableJobs();
  const jobToRemove = existingJobs.find(
    (job) => job.name === `${userId}-${reportType}`
  );
  
  if (jobToRemove) {
    await reportQueue.removeRepeatableByKey(jobToRemove.key);
  }

  // Schedule new report
  await reportQueue.add(
    {
      userId,
      reportType,
    },
    {
      repeat: {
        cron: schedule,
      },
      jobId: `${userId}-${reportType}`,
    }
  );
}

export async function unscheduleReport(
  userId: string,
  reportType: 'daily' | 'weekly' | 'monthly'
) {
  const existingJobs = await reportQueue.getRepeatableJobs();
  const jobToRemove = existingJobs.find(
    (job) => job.name === `${userId}-${reportType}`
  );
  
  if (jobToRemove) {
    await reportQueue.removeRepeatableByKey(jobToRemove.key);
  }
}

export async function getUserScheduledReports(userId: string) {
  const jobs = await reportQueue.getRepeatableJobs();
  return jobs.filter((job) => job.name.startsWith(userId));
}

export async function generateImmediateReport(
  userId: string,
  reportType: 'daily' | 'weekly' | 'monthly'
) {
  return reportQueue.add(
    {
      userId,
      reportType,
    },
    {
      jobId: `${userId}-${reportType}-immediate-${Date.now()}`,
      attempts: 1,
    }
  );
}

// Queue monitoring
export async function getQueueHealth() {
  const [
    active,
    waiting,
    completed,
    failed,
    delayed,
    paused,
    repeatableJobs,
  ] = await Promise.all([
    reportQueue.getActive(),
    reportQueue.getWaiting(),
    reportQueue.getCompleted(),
    reportQueue.getFailed(),
    reportQueue.getDelayed(),
    reportQueue.getPaused(),
    reportQueue.getRepeatableJobs(),
  ]);

  return {
    active: active.length,
    waiting: waiting.length,
    completed: completed.length,
    failed: failed.length,
    delayed: delayed.length,
    paused: paused.length,
    repeatable: repeatableJobs.length,
  };
}

// Cleanup functions
export async function cleanupOldJobs(olderThan: number = 7 * 24 * 60 * 60 * 1000) { // 7 days
  const cutoff = Date.now() - olderThan;
  await reportQueue.clean(cutoff, 'completed');
  await reportQueue.clean(cutoff, 'failed');
}

// Graceful shutdown
export async function closeQueue() {
  await reportQueue.close();
  await redisClient.quit();
}