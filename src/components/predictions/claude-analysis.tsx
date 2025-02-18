import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, List, MessageCircle, LightbulbIcon } from 'lucide-react';

interface ClaudeAnalysisProps {
  analysis: {
    factors: string[];
    reasoning: string;
    recommendations: string[];
  };
  className?: string;
}

export function ClaudeAnalysis({ analysis, className = '' }: ClaudeAnalysisProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5" />
          <span>Claude Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Factors */}
          <div>
            <h3 className="flex items-center space-x-2 font-medium mb-2">
              <List className="w-4 h-4" />
              <span>Key Factors</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {analysis.factors.map((factor, index) => (
                <li key={index} className="text-gray-600">{factor}</li>
              ))}
            </ul>
          </div>

          {/* Reasoning */}
          <div>
            <h3 className="flex items-center space-x-2 font-medium mb-2">
              <MessageCircle className="w-4 h-4" />
              <span>Analysis</span>
            </h3>
            <p className="text-sm text-gray-600">{analysis.reasoning}</p>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="flex items-center space-x-2 font-medium mb-2">
              <LightbulbIcon className="w-4 h-4" />
              <span>Recommendations</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-600">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
