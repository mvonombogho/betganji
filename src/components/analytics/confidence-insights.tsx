import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface ConfidenceInsightsProps {
  data: Array<{
    range: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
}

export function ConfidenceInsights({ data }: ConfidenceInsightsProps) {
  const getMostReliableRange = () => {
    return data.reduce((prev, current) => 
      current.accuracy > prev.accuracy ? current : prev
    );
  };

  const getLeastReliableRange = () => {
    return data.reduce((prev, current) => 
      current.accuracy < prev.accuracy ? current : prev
    );
  };

  const getMostCommonRange = () => {
    return data.reduce((prev, current) => 
      current.total > prev.total ? current : prev
    );
  };

  const mostReliable = getMostReliableRange();
  const leastReliable = getLeastReliableRange();
  const mostCommon = getMostCommonRange();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="font-medium text-green-700">Most Reliable</h3>
        </div>
        <p className="mt-2 text-sm text-green-600">
          {mostReliable.range} range has {mostReliable.accuracy.toFixed(1)}% accuracy
          with {mostReliable.total} predictions
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium text-yellow-700">Least Reliable</h3>
        </div>
        <p className="mt-2 text-sm text-yellow-600">
          {leastReliable.range} range has {leastReliable.accuracy.toFixed(1)}% accuracy
          with {leastReliable.total} predictions
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-blue-700">Most Common</h3>
        </div>
        <p className="mt-2 text-sm text-blue-600">
          {mostCommon.range} is the most frequent with {mostCommon.total} predictions
          and {mostCommon.accuracy.toFixed(1)}% accuracy
        </p>
      </div>
    </div>
  );
}
