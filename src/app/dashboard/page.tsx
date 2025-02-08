// src/app/dashboard/page.tsx
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to BetGanji</h1>
      <p className="mt-4 text-lg text-gray-600">
        Your AI-powered sports prediction platform
      </p>
      <div className="mt-6">
        <Button>Get Started</Button>
      </div>
    </div>
  )
}