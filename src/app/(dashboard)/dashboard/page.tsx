import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth/verify';
import { redirect } from 'next/navigation';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentPredictions } from '@/components/dashboard/recent-predictions';

async function getDashboardData() {
  const session = await getServerSession();
  if (!session?.userId) {
    redirect('/login');
  }

  // Get user's predictions
  const predictions = await prisma.prediction.findMany({
    where: {
      userId: session.userId,
    },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  // Calculate stats
  const totalPredictions = await prisma.prediction.count({
    where: {
      userId: session.userId,
    },
  });

  const completedPredictions = await prisma.prediction.count({
    where: {
      userId: session.userId,
      isCorrect: { not: null },
    },
  });

  const correctPredictions = await prisma.prediction.count({
    where: {
      userId: session.userId,
      isCorrect: true,
    },
  });

  const accuracy = completedPredictions > 0
    ? (correctPredictions / completedPredictions) * 100
    : 0;

  return {
    predictions,
    stats: {
      totalPredictions,
      completedPredictions,
      correctPredictions,
      accuracy,
    },
  };
}

export default async function DashboardPage() {
  const { predictions, stats } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentPredictions predictions={predictions} />

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Upcoming Matches</h2>
          <p className="text-gray-500">Match listing coming soon</p>
        </div>
      </div>
    </div>
  );
}
