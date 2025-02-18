import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrainingProgress } from '@/lib/ml/training-pipeline';

interface TrainingProgressChartProps {
  data: TrainingProgress[];
  className?: string;
}

export function TrainingProgressChart({ data, className = '' }: TrainingProgressChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Training Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="epoch" 
                label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#8884d8" 
                name="Training Accuracy"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="valAccuracy" 
                stroke="#82ca9d" 
                name="Validation Accuracy"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#ff7300" 
                name="Training Loss"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="valLoss" 
                stroke="#ff0000" 
                name="Validation Loss"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
