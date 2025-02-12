import Link from "next/link"
import { PredictionList } from "@/components/predictions/prediction-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Prediction } from "@/types/prediction"

// Demo data - replace with actual data fetching
const demoPredictions: Prediction[] = [
  {
    id: "1",
    matchId: "1",
    userId: "1",
    type: "match_result",
    prediction: "Manchester United to win",
    odds: 2.1,
    confidence: 75,
    status: "pending",
    analysis: "United's home form has been excellent",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    matchId: "2",
    userId: "1",
    type: "over_under",
    prediction: "Over 2.5 goals",
    odds: 1.95,
    confidence: 80,
    status: "won",
    result: "3-1",
    analysis: "Both teams have been scoring freely",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
  },
]

export default async function PredictionsPage() {
  // In a real app, fetch predictions from your API/database
  const predictions = demoPredictions
  const activePredictions = predictions.filter(p => p.status === 'pending')
  const completedPredictions = predictions.filter(p => p.status !== 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Predictions</h1>
          <p className="text-muted-foreground">
            View and manage your betting predictions
          </p>
        </div>
        <Button asChild>
          <Link href="/predictions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Prediction
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Active Predictions</h2>
          <PredictionList predictions={activePredictions} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Completed Predictions</h2>
          <PredictionList predictions={completedPredictions} />
        </div>
      </div>
    </div>
  )
}