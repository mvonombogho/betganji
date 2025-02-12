import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { PredictionForm } from "@/components/predictions/prediction-form"
import { Button } from "@/components/ui/button"

export default function NewPredictionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/predictions">
            <ChevronLeft className="h-4 w-4" />
            Back to predictions
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New Prediction</h1>
        <p className="text-muted-foreground">
          Make your prediction and provide your analysis
        </p>
      </div>

      <div className="max-w-2xl">
        <PredictionForm />
      </div>

      <div className="max-w-2xl mt-8 p-4 bg-muted rounded-lg">
        <h2 className="font-semibold mb-2">Tips for good predictions:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Consider team form, head-to-head records, and injuries</li>
          <li>Review recent performances and playing styles</li>
          <li>Check weather conditions and venue statistics</li>
          <li>Evaluate odds from multiple bookmakers</li>
          <li>Don&apos;t let emotions influence your decisions</li>
        </ul>
      </div>
    </div>
  )
}