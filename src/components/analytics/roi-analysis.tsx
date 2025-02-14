import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface ROIAnalysisProps {
  data: {
    investment: number;
    returns: number;
    bets: number;
    winRate: number;
    profitHistory: {
      date: string;
      profit: number;
      cumulativeROI: number;
    }[];
  };
}

export default function ROIAnalysis({ data }: ROIAnalysisProps) {
  const roi = ((data.returns - data.investment) / data.investment) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.returns - data.investment)}
            </div>
            <div className="text-sm text-gray-600">Net Profit</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">
              {roi.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">
              {data.bets}
            </div>
            <div className="text-sm text-gray-600">Total Bets</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">
              {data.winRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.profitHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="profit" 
                stroke="#8884d8" 
                name="Daily Profit"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cumulativeROI" 
                stroke="#82ca9d" 
                name="Cumulative ROI"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}