import LiveMatchCard from '@/components/matches/LiveMatchCard';
import { TimelineEvent } from '@/types/match';

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
      />
    </div>
  );
}