import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfidenceAdjustmentProps {
  mlConfidence: number;
  claudeAdjustment: number;
  finalConfidence: number;
  className?: string;
}

export function ConfidenceAdjustment({ 
  mlConfidence,
  claudeAdjustment,
  finalConfidence,
  className = ''
}: ConfidenceAdjustmentProps) {
  // Calculate the width percentages for the visualization
  const mlWidth = `${mlConfidence}%`;
  const adjustmentWidth = `${Math.abs(claudeAdjustment * 100)}%`;
  const finalWidth = `${finalConfidence}%`;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Confidence Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ML Model Confidence */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>ML Model Confidence</span>
              <span className="font-medium">{mlConfidence.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: mlWidth }}
              />
            </div>
          </div>

          {/* Claude's Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Claude's Adjustment</span>
              <span className={`font-medium ${claudeAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {claudeAdjustment >= 0 ? '+' : ''}{(claudeAdjustment * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  claudeAdjustment >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: adjustmentWidth }}
              />
            </div>
          </div>

          {/* Final Confidence */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Final Confidence</span>
              <span>{finalConfidence.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: finalWidth }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
