import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db"
import { BettingService } from "@/lib/data/services/betting-service"
import { BankrollOverview } from "@/components/bankroll/bankroll-overview"

const bettingService = new BettingService()

export default async function BankrollPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Get user's bankroll
  const bankroll = await db.bankroll.findUnique({
    where: { userId: session.user.id },
    include: {
      bettingSites: true,
      history: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })

  if (!bankroll) {
    redirect("/bankroll/setup")
  }

  // Get betting stats
  const stats = await bettingService.getBettingStats(session.user.id)

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bankroll Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your betting capital
          </p>
        </div>
      </div>

      <BankrollOverview 
        bankroll={bankroll} 
        stats={stats}
      />
    </div>
  )
}