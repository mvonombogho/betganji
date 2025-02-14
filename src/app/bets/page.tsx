import ManualBetSlip from '@/components/bets/ManualBetSlip';
import BetHistory from '@/components/bets/BetHistory';

export default function BetsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Record New Bet</h2>
          <ManualBetSlip
            matchId="demo"
            prediction="Sample Prediction"
            onSubmit={async (data) => {
              // This will be replaced with real match data
              console.log('Submitted bet:', data);
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Bets</h2>
          <BetHistory />
        </div>
      </div>
    </div>
  );
}