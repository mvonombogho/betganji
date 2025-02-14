import React from 'react';
import { Metadata } from 'next';
import { getROIAnalysis } from '@/lib/data/services/analytics-service';
import ROIAnalysis from '@/components/analytics/roi-analysis';
import { auth } from '@/lib/auth';
import { addMonths } from 'date-fns';

export const metadata: Metadata = {
  title: 'Analytics | BetGanji',
  description: 'Track your betting performance and ROI'
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const endDate = new Date();
  const startDate = addMonths(endDate, -3); // Last 3 months

  const roiData = await getROIAnalysis(session.user.id, startDate, endDate);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      <ROIAnalysis data={roiData} />

      {/* More analytics components will be added here */}
    </div>
  );
}