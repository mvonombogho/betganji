'use client'

import { ActivitySquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Demo data - will be replaced with real data later
const activities = [
  {
    id: 1,
    type: 'prediction',
    description: 'New prediction: Manchester United vs Arsenal',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'win',
    description: 'Prediction won: Liverpool vs Chelsea',
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    type: 'odds',
    description: 'Odds changed for Bayern Munich vs Dortmund',
    timestamp: '1 day ago',
  },
]

function ActivityItem({ activity }: { activity: typeof activities[0] }) {
  return (
    <div className="flex items-center space-x-4 rounded-lg p-3 hover:bg-accent">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <ActivitySquare className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          {activity.description}
        </p>
        <p className="text-sm text-muted-foreground">
          {activity.timestamp}
        </p>
      </div>
    </div>
  )
}

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}