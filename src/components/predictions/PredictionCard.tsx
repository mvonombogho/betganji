import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MinusIcon,
  InfoIcon,
  TrendingUp 
} from 'lucide-react';
import { Prediction, PredictionInsights } from '@/types';

interface PredictionCardProps {
  prediction: Prediction;
  insights: PredictionInsights;
  isLoading?: boolean;
}

export function PredictionCard({ prediction, insights, isLoading = false }: PredictionCardProps) {
  const getResultIcon = (result: string) => {
    switch (result) {
      case 'home_win':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'away_win':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'bg-green-100 text-green-800';
    if (confidence >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Match Prediction</CardTitle>
          <Badge 
            variant="secondary"
            className={getConfidenceColor(prediction.confidence)}
          >
            {prediction.confidence}% Confidence
          </Badge>
        </div>
        <CardDescription>
          Generated at {new Date(prediction.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Prediction Result */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 rounded-full">
              {getResultIcon(prediction.result)}
            </div>
            <div>
              <p className="font-medium">Predicted Outcome</p>
              <p className="text-sm text-gray-600">
                {prediction.result.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>

          {/* Key Factors */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Key Factors
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {insights.keyFactors.map((factor, index) => (
                <li key={index} className="text-sm text-gray-600">{factor}</li>
              ))}
            </ul>
          </div>

          {/* Risk Analysis */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Risk Analysis
            </h3>
            <p className="text-sm text-gray-600">{insights.riskAnalysis}</p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <InfoIcon className="w-4 h-4" />
              Additional Insights
            </h3>
            <p className="text-sm text-gray-600">{insights.additionalNotes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
