import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db"
import { BankrollSetupForm } from "@/components/bankroll/bankroll-setup-form"

export default async function BankrollSetupPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Check if user already has a bankroll
  const existingBankroll = await db.bankroll.findUnique({
    where: { userId: session.user.id }
  })

  if (existingBankroll) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex flex-col items-center justify-center py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Set Up Your Betting Bankroll</h1>
        <p className="text-muted-foreground mt-2">
          Configure your bankroll and risk management settings to get started.
        </p>
      </div>

      <BankrollSetupForm />

      <div className="mt-8 max-w-md text-sm text-muted-foreground">
        <p className="mb-2">
          Your bankroll settings help you:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Track your betting capital across different sites</li>
          <li>Set limits to manage your risk</li>
          <li>Monitor your betting performance</li>
          <li>Make data-driven betting decisions</li>
        </ul>
      </div>
    </div>
  )
}