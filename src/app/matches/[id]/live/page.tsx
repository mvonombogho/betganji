import LiveMatchCard from '@/components/matches/LiveMatchCard';
import type { TimelineEvent, LiveMatchStats } from '@/types/match';

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
      />
    </div>
  );
}