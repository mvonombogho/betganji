import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth/verify';
import { PredictionList } from '@/components/predictions/prediction-list';
import { redirect } from 'next/navigation';

async function getUserPredictions() {
  const session = await getServerSession();
  if (!session?.userId) {
    redirect('/login');
  }

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
  });

  return predictions;
}

export default async function PredictionsPage() {
  const predictions = await getUserPredictions();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Predictions</h1>
      </div>

      <PredictionList predictions={predictions} />
    </div>
  );
}
