import { prisma } from '@/lib/db';

async function getDashboardData() {
  const upcomingMatches = await prisma.match.findMany({
    where: {
      datetime: {
        gte: new Date(),
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      odds: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      datetime: 'asc',
    },
    take: 5,
  });

  return {
    upcomingMatches,
  };
}

export default async function DashboardPage() {
  const { upcomingMatches } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Upcoming Matches</h2>
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm text-gray-500 mb-1">
                  {new Date(match.datetime).toLocaleDateString()}
                </div>
                <div className="font-medium">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </div>
                {match.odds[0] && (
                  <div className="text-sm text-gray-500 mt-1">
                    Odds: {match.odds[0].homeWin.toFixed(2)} - {match.odds[0].draw.toFixed(2)} - {match.odds[0].awayWin.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Predictions</h2>
          <p className="text-gray-500">No predictions yet</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Predictions</div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Accuracy</div>
              <div className="text-2xl font-bold">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
