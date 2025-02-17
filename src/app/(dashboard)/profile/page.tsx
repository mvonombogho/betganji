import { getServerSession } from '@/lib/auth/verify';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { StatsOverview } from '@/components/profile/stats-overview';
import { RecentPredictions } from '@/components/profile/recent-predictions';
import { calculateUserStats } from '@/lib/stats/calculate-user-stats';

async function getUserProfile(userId: string) {
  const [user, stats, recentPredictions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    calculateUserStats(userId),
    prisma.prediction.findMany({
      where: { userId },
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
      take: 5, // Get only the 5 most recent predictions
    }),
  ]);

  if (!user) {
    redirect('/login');
  }

  return { user, stats, recentPredictions };
}

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const { user, stats, recentPredictions } = await getUserProfile(session.userId);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Name:</span> {user.name || 'Not set'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Member since:</span>{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Statistics Overview</h2>
        <StatsOverview stats={stats} />
      </div>

      {/* Recent Predictions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Predictions</h2>
          <Link 
            href="/predictions" 
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <RecentPredictions predictions={recentPredictions} />
      </div>
    </div>
  );
}
