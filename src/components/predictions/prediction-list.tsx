'use client'

import { Prediction } from "@/types/prediction"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface PredictionListProps {
  predictions: Prediction[]
}

const statusColors = {
  pending: "bg-yellow-500",
  won: "bg-green-500",
  lost: "bg-red-500",
  void: "bg-gray-500",
} as const

export function PredictionList({ predictions }: PredictionListProps) {
  if (!predictions.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No predictions yet</h3>
        <p className="text-muted-foreground">
          Start by creating your first prediction
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <Card key={prediction.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {prediction.prediction}
              </CardTitle>
              <Badge 
                variant="secondary"
                className={statusColors[prediction.status]}
              >
                {prediction.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">
                  {prediction.type.split("_").map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(" ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Odds:</span>
                <span className="font-medium">{prediction.odds}</span>
              </div>
              {prediction.stake && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stake:</span>
                  <span className="font-medium">{prediction.stake}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">{prediction.confidence}%</span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <p className="text-muted-foreground">
                  Created {formatDistanceToNow(prediction.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}