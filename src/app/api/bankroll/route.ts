import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { BettingService } from "@/lib/data/services/betting-service"
import { db } from "@/lib/db"
import { z } from "zod"

const bettingService = new BettingService()

// Schema for initializing bankroll
const initBankrollSchema = z.object({
  initialCapital: z.number().positive(),
  currency: z.string().default("USD"),
  maxStakePerBet: z.number().positive(),
  maxStakePerDay: z.number().positive(),
  stakeUnit: z.enum(["fixed", "percentage"]),
  stopLoss: z.number().optional(),
  targetProfit: z.number().optional(),
})

// Schema for adding betting site
const addSiteSchema = z.object({
  name: z.string(),
  currentBalance: z.number().nonnegative(),
  totalDeposited: z.number().nonnegative(),
  totalWithdrawn: z.number().nonnegative(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = initBankrollSchema.parse(json)

    // Check if user already has a bankroll
    const existingBankroll = await db.bankroll.findUnique({
      where: { userId: session.user.id }
    })

    if (existingBankroll) {
      return new NextResponse(
        "Bankroll already exists for this user", 
        { status: 400 }
      )
    }

    const bankroll = await bettingService.initializeBankroll(
      session.user.id,
      body
    )

    return NextResponse.json(bankroll)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[BANKROLL_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

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
      return new NextResponse("Bankroll not found", { status: 404 })
    }

    // Get betting stats
    const stats = await bettingService.getBettingStats(session.user.id)

    return NextResponse.json({
      bankroll,
      stats
    })
  } catch (error) {
    console.error("[BANKROLL_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { action } = json

    if (action === "addSite") {
      const data = addSiteSchema.parse(json.data)
      const bankroll = await db.bankroll.findUnique({
        where: { userId: session.user.id }
      })

      if (!bankroll) {
        return new NextResponse("Bankroll not found", { status: 404 })
      }

      const site = await bettingService.addBettingSite(bankroll.id, data)
      return NextResponse.json(site)
    }

    return new NextResponse("Invalid action", { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[BANKROLL_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}