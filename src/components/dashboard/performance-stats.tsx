'use client'

import { Line } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const demoData = [
  { month: 'Jan', winRate: 65 },
  { month: 'Feb', winRate: 59 },
  { month: 'Mar', winRate: 80 },
  { month: 'Apr', winRate: 71 },
  { month: 'May', winRate: 56 },
  { month: 'Jun', winRate: 55 },
]

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  trend?: 'up' | 'down'
}

function StatsCard({ title, value, description, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export function PerformanceStats() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Win Rate"
          value="67%"
          description="+5.2% from last month"
          trend="up"
        />
        <StatsCard
          title="ROI"
          value="12.3%"
          description="Based on all bets"
        />
        <StatsCard
          title="Active Predictions"
          value="7"
          description="4 matches today"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="winRate" 
                  stroke="#2563eb"
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}