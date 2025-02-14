import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getROIAnalysis } from '@/lib/data/services/analytics-service';
import { getStreakAnalysis } from '@/lib/data/services/streak-service';
import { getPerformancePatterns } from '@/lib/data/services/patterns-service';
import ROIAnalysis from '@/components/analytics/roi-analysis';
import StreakAnalysis from '@/components/analytics/streak-analysis';
import PerformancePatterns from '@/components/analytics/performance-patterns';
import { LoadingState } from '@/components/ui/loading-state';
import { AnalyticsCard } from '@/components/analytics/analytics-card';
import { auth } from '@/lib/auth';
import { addMonths } from 'date-fns';

export const metadata: Metadata = {
  title: 'Analytics | BetGanji',
  description: 'Track your betting performance and ROI'
};

async function AnalyticsData() {
  const session = await auth();
  if (!session?.user) return null;

  const endDate = new Date();
  const startDate = addMonths(endDate, -3);

  try {
    const [roiData, streakData, patternsData] = await Promise.all([
      getROIAnalysis(session.user.id, startDate, endDate),
      getStreakAnalysis(session.user.id),
      getPerformancePatterns(session.user.id)
    ]);

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsCard title="ROI Analysis">
          <ROIAnalysis data={roiData} />
        </AnalyticsCard>
        
        <AnalyticsCard title="Streak Analysis">
          <StreakAnalysis data={streakData} />
        </AnalyticsCard>

        <AnalyticsCard title="Performance Patterns" className="md:col-span-2">
          <PerformancePatterns data={patternsData} />
        </AnalyticsCard>
      </div>
    );
  } catch (error) {
    throw error;
  }
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsCard title="ROI Analysis" loading />
            <AnalyticsCard title="Streak Analysis" loading />
            <AnalyticsCard title="Performance Patterns" className="md:col-span-2" loading />
          </div>
        }
      >
        <AnalyticsData />
      </Suspense>
    </div>
  );
}