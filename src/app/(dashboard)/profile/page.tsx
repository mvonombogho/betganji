import { getServerSession } from '@/lib/auth/verify';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { UserStats } from '@/components/profile/user-stats';
import { PredictionHistory } from '@/components/profile/prediction-history';

async function getUserData(userId: string) {
  const [user, predictions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
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
    }),
  ]);

  if (!user) {
    redirect('/login');
  }

  // Calculate user statistics
  const stats = {
    totalPredictions: predictions.length,
    completedPredictions: predictions.filter(p => p.isCorrect !== null).length,
    correctPredictions: predictions.filter(p => p.isCorrect === true).length,
    accuracy: 0,
  };

  stats.accuracy = stats.completedPredictions > 0
    ? (stats.correctPredictions / stats.completedPredictions) * 100
    : 0;

  return {
    user,
    predictions,
    stats,
  };
}

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const { user, predictions, stats } = await getUserData(session.userId);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">
          Profile
        </h1>
        <p className="text-gray-500">
          {user.name || user.email}
        </p>
      </div>

      {/* User Statistics */}
      <UserStats stats={stats} />

      {/* Prediction History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Prediction History</h2>
        <PredictionHistory predictions={predictions} />
      </div>
    </div>
  );
}
