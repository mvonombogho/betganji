import { Activity, CheckCircle, Target, Percent } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalPredictions: number;
    completedPredictions: number;
    correctPredictions: number;
    accuracy: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Predictions',
      value: stats.totalPredictions,
      icon: Activity,
      description: 'All-time predictions made',
    },
    {
      title: 'Completed',
      value: stats.completedPredictions,
      icon: CheckCircle,
      description: 'Predictions with results',
    },
    {
      title: 'Correct',
      value: stats.correctPredictions,
      icon: Target,
      description: 'Accurate predictions',
    },
    {
      title: 'Success Rate',
      value: `${stats.accuracy.toFixed(1)}%`,
      icon: Percent,
      description: 'Overall accuracy',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              {card.title}
            </h3>
            <card.icon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">
              {card.value}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
