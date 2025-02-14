import LiveMatchCard from '@/components/matches/LiveMatchCard';
import type { TimelineEvent, LiveMatchStats } from '@/types/match';
import type { LiveOdds } from '@/types/odds';

const demoEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'GOAL',
    minute: 23,
    team: 'home',
    playerName: 'John Smith',
    additionalInfo: 'Header from corner'
  },
  {
    id: '2',
    type: 'YELLOW_CARD',
    minute: 35,
    team: 'away',
    playerName: 'Mike Johnson',
    additionalInfo: 'Rough tackle'
  },
];

const demoStats: LiveMatchStats = {
  possession: { home: 57, away: 43 },
  shots: { home: 8, away: 6 },
  shotsOnTarget: { home: 3, away: 2 },
  corners: { home: 4, away: 2 }
};

const demoOdds: LiveOdds = {
  matchId: '1',
  provider: 'Betfair',
  home: 2.10,
  draw: 3.40,
  away: 3.75,
  timestamp: new Date().toISOString(),
  status: 'active',
  movements: {
    home: {
      previous: 2.05,
      current: 2.10,
      trend: 'up'
    },
    draw: {
      previous: 3.40,
      current: 3.40,
      trend: 'stable'
    },
    away: {
      previous: 3.80,
      current: 3.75,
      trend: 'down'
    }
  }
};

export default function LiveMatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <LiveMatchCard
        matchId={params.id}
        homeTeam="Manchester United"
        awayTeam="Liverpool"
        initialStatus="FIRST_HALF"
        initialScore={{ home: 1, away: 0 }}
        initialEvents={demoEvents}
        initialStats={demoStats}
        initialOdds={demoOdds}
      />
    </div>
  );
}