import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Prediction, AnalysisFactor } from '@/types/prediction';

interface PredictionInsightsProps {
  prediction: Prediction;
  isLoading?: boolean;
}

const PredictionInsights: React.FC<PredictionInsightsProps> = ({ 
  prediction,
  isLoading 
}) => {
  if (isLoading || !prediction.insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { insights } = prediction;

  const getImpactColor = (impact: number) => {
    if (impact > 0.5) return 'text-green-600';
    if (impact < -0.5) return 'text-red-600';
    return 'text-yellow-600';
  };

  const renderFactor = (factor: AnalysisFactor) => (
    <div key={factor.name} className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{factor.name}</span>
        <span className={getImpactColor(factor.impact)}>
          {Math.abs(factor.impact * 100).toFixed(0)}% 
          {factor.impact > 0 ? 'Positive' : 'Negative'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
      <Progress 
        value={50 + (factor.impact * 50)} 
        className="h-2"
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI Analysis</span>
          <Badge
            variant={insights.riskLevel === 'LOW' ? 'success' : 
                    insights.riskLevel === 'MEDIUM' ? 'warning' : 'destructive'}
          >
            {insights.riskLevel} RISK
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Key Factors</h4>
            <div className="space-y-4">
              {insights.factors.map(renderFactor)}
            </div>
          </div>

          {insights.recommendedBets && insights.recommendedBets.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Recommended Bets</h4>
              <div className="space-y-2">
                {insights.recommendedBets.map(bet => (
                  <div 
                    key={`${bet.market}-${bet.selection}`}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{bet.market}</span>
                      <span className="text-sm">
                        Confidence: {bet.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{bet.selection}</span>
                      <span className="font-medium">@ {bet.odds.toFixed(2)}</span>
                    </div>
                    {bet.stake > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        Suggested stake: {bet.stake}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Confidence Score</h4>
            <div className="flex items-center gap-4">
              <Progress 
                value={insights.confidenceScore} 
                className="h-4"
              />
              <span className="font-medium">
                {insights.confidenceScore}%
              </span>
            </div>
          </div>

          {insights.additionalNotes && (
            <div>
              <h4 className="font-semibold mb-2">Additional Notes</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {insights.additionalNotes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionInsights;