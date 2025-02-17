import { prisma } from '@/lib/db';

export async function calculateUserStats(userId: string) {
  // Get all user predictions
  const predictions = await prisma.prediction.findMany({
    where: { userId },
  });

  // Calculate basic stats
  const totalPredictions = predictions.length;
  const completedPredictions = predictions.filter(p => p.isCorrect !== null).length;
  const correctPredictions = predictions.filter(p => p.isCorrect === true).length;
  const pendingPredictions = totalPredictions - completedPredictions;

  // Calculate accuracy
  const accuracy = completedPredictions > 0
    ? (correctPredictions / completedPredictions) * 100
    : 0;

  return {
    totalPredictions,
    correctPredictions,
    pendingPredictions,
    accuracy,
  };
}
