import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import MatchScatterPlot from './match-scatter-plot';
import RecentMatchesTable from './recent-matches-table';
import { MatchDetails, type Match } from './match-drill-down';

interface MatchDrillDownContainerProps {
  matches: Match[];
  className?: string;
}

export default function MatchDrillDownContainer({
  matches,
  className = '',
}: MatchDrillDownContainerProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMatch(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <MatchScatterPlot 
        matches={matches} 
        onMatchSelect={handleMatchSelect} 
      />
      
      <RecentMatchesTable 
        matches={matches.slice(0, 5)} 
        onMatchSelect={handleMatchSelect} 
      />

      <Dialog 
        open={showDetails} 
        onOpenChange={setShowDetails}
      >
        {selectedMatch && (
          <MatchDetails
            match={selectedMatch}
            onClose={handleCloseDetails}
          />
        )}
      </Dialog>
    </div>
  );
}