import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface ConfidenceTooltipProps {
  mlConfidence: number;
  claudeAdjustment: number;
  finalConfidence: number;
}

export function ConfidenceTooltip({ 
  mlConfidence,
  claudeAdjustment,
  finalConfidence 
}: ConfidenceTooltipProps) {
  const getAdjustmentExplanation = () => {
    if (claudeAdjustment > 0) {
      return 'Claude increased confidence based on additional factors';
    } else if (claudeAdjustment < 0) {
      return 'Claude decreased confidence due to potential risks';
    }
    return 'Claude confirmed ML model confidence';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="font-medium">Confidence Calculation</h4>
            
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">ML Model: </span>
                {mlConfidence.toFixed(1)}% base confidence
              </p>
              
              <p>
                <span className="font-medium">Claude's Adjustment: </span>
                {claudeAdjustment >= 0 ? '+' : ''}{(claudeAdjustment * 100).toFixed(1)}%
              </p>
              
              <p className="text-gray-600 italic">
                {getAdjustmentExplanation()}
              </p>
              
              <p className="pt-2">
                <span className="font-medium">Final Confidence: </span>
                {finalConfidence.toFixed(1)}%
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
