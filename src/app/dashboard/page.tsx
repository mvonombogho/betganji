import React, { Suspense } from 'react';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { DashboardSettings } from '@/components/dashboard/dashboard-settings';
import { auth } from '@/lib/auth';
import { getUserDashboardSettings, updateUserDashboardSettings } from '@/lib/data/services/user-service';

// Default dashboard layouts
const defaultLayouts = [
  {
    id: 'quick-stats',
    title: 'Quick Stats',
    width: 'full',
    height: 'small',
    visible: true,
    component: <QuickStats />
  },
  {
    id: 'recent-predictions',
    title: 'Recent Predictions',
    width: 'half',
    height: 'medium',
    visible: true,
    component: <RecentPredictions />
  },
  {
    id: 'performance-overview',
    title: 'Performance Overview',
    width: 'half',
    height: 'medium',
    visible: true,
    component: <PerformanceOverview />
  },
  {
    id: 'upcoming-matches',
    title: 'Upcoming Matches',
    width: 'third',
    height: 'large',
    visible: true,
    component: <UpcomingMatches />
  },
  {
    id: 'bankroll-tracker',
    title: 'Bankroll Tracker',
    width: 'third',
    height: 'large',
    visible: true,
    component: <BankrollTracker />
  },
  {
    id: 'leagues-overview',
    title: 'Leagues Overview',
    width: 'third',
    height: 'large',
    visible: true,
    component: <LeaguesOverview />
  }
];

async function DashboardContent() {
  const session = await auth();
  if (!session?.user) return null;

  const userSettings = await getUserDashboardSettings(session.user.id);
  const layouts = userSettings?.layouts || defaultLayouts;

  const handleLayoutChange = async (newLayouts: any[]) => {
    await updateUserDashboardSettings(session.user.id, { layouts: newLayouts });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DashboardSettings layouts={layouts} onLayoutChange={handleLayoutChange} />
      </div>

      <DashboardGrid layouts={layouts} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardGrid layouts={defaultLayouts} loading />}>
      <DashboardContent />
    </Suspense>
  );
}