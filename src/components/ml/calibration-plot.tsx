import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer } from 'recharts';

interface CalibrationData {
  confidence: number;
  accuracy: number;
  count: number;
}

interface CalibrationPlotProps {
  data: CalibrationData[];
  className?: string;
}

export function CalibrationPlot({ data, className = '' }: CalibrationPlotProps) {
  // Add perfect calibration line points
  const perfectCalibration = [
    { confidence: 0, accuracy: 0 },
    { confidence: 1, accuracy: 1 }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Prediction Calibration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="confidence" 
                name="Confidence" 
                domain={[0, 1]}
                label={{ value: 'Predicted Probability', position: 'bottom' }}
              />
              <YAxis 
                type="number" 
                dataKey="accuracy" 
                name="Accuracy" 
                domain={[0, 1]}
                label={{ value: 'Observed Frequency', angle: -90, position: 'left' }}
              />
              
              {/* Perfect calibration line */}
              <Line
                data={perfectCalibration}
                type="monotone"
                dataKey="accuracy"
                stroke="#ff7300"
                strokeDasharray="3 3"
                name="Perfect Calibration"
              />
              
              {/* Actual calibration points */}
              <Scatter
                data={data}
                fill="#8884d8"
                name="Calibration Points"
              />
              
              <Tooltip
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0'
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Points closer to the diagonal line indicate better calibrated predictions.
          Points above the line indicate underconfidence, while points below indicate
          overconfidence.
        </div>
      </CardContent>
    </Card>
  );
}
