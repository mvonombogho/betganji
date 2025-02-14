import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Check } from 'lucide-react';

const EnhancedPrediction = ({ matchId, prediction }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [leagueStats, setLeagueStats] = useState(null);

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        const historical = await fetch(`/api/predictions/historical/${matchId}`);
        const league = await fetch(`/api/predictions/league-stats/${prediction.leagueId}`);
        
        setHistoricalData(await historical.json());
        setLeagueStats(await league.json());
      } catch (error) {
        console.error('Error fetching prediction data:', error);
      }
    };

    fetchPredictionData();
  }, [matchId]);

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 80) return { color: 'text-green-600', label: 'High' };
    if (confidence >= 60) return { color: 'text-yellow-600', label: 'Medium' };
    return { color: 'text-red-600', label: 'Low' };
  };

  const confidenceInfo = getConfidenceLevel(prediction.confidence);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prediction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Confidence Level</h3>
              <div className="flex items-center space-x-2">
                <Progress value={prediction.confidence} className="w-full" />
                <Badge className={confidenceInfo.color}>
                  {confidenceInfo.label}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Historical Accuracy</h3>
              {historicalData && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{historicalData.accuracy}% Success Rate</span>
                </div>
              )}
            </div>

            {prediction.patterns && (
              <div className="col-span-2 space-y-2">
                <h3 className="font-semibold">Identified Patterns</h3>
                <div className="grid grid-cols-2 gap-2">
                  {prediction.patterns.map((pattern, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      {pattern.type === 'positive' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span>{pattern.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leagueStats && (
              <div className="col-span-2 space-y-2">
                <h3 className="font-semibold">League Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold">{leagueStats.totalPredictions}</div>
                    <div className="text-sm text-gray-600">Total Predictions</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold">{leagueStats.successRate}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold">{leagueStats.averageConfidence}%</div>
                    <div className="text-sm text-gray-600">Avg Confidence</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPrediction;