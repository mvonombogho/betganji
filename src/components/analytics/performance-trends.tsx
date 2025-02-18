import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DailyStats {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface PerformanceTrendsProps {
  data: DailyStats[];
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export function PerformanceTrends({ 
  data, 
  timeRange, 
  onTimeRangeChange 
}: PerformanceTrendsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Performance Trends</CardTitle>
        <Select
          value={timeRange}
          onValueChange={onTimeRangeChange}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Chart will go here */}
      </CardContent>
    </Card>
  );
}
