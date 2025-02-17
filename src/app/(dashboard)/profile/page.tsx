import { getServerSession } from '@/lib/auth/verify';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { StatsOverview } from '@/components/profile/stats-overview';
import { calculateUserStats } from '@/lib/stats/calculate-user-stats';

async function getUserProfile(userId: string) {
  const [user, stats] = await Promise.all([
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
  ]);

  if (!user) {
    redirect('/login');
  }

  return { user, stats };
}

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const { user, stats } = await getUserProfile(session.userId);

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

      {/* Placeholder for Prediction History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Predictions</h2>
        <p className="text-gray-500">Recent predictions will be displayed here</p>
      </div>
    </div>
  );
}
