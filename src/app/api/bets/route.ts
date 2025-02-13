import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { BettingService } from "@/lib/data/services/betting-service"
import { db } from "@/lib/db"
import { z } from "zod"

const bettingService = new BettingService()

const placeBetSchema = z.object({
  matchId: z.string(),
  type: z.enum(["single", "multiple", "system"]),
  selection: z.string(),
  odds: z.number().positive(),
  stake: z.number().positive(),
  bettingSite: z.string(),
  reasoning: z.string(),
  confidenceLevel: z.number().min(1).max(10),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const data = placeBetSchema.parse(json)

    // Check if user has a bankroll
    const bankroll = await db.bankroll.findUnique({
      where: { userId: session.user.id }
    })

    if (!bankroll) {
      return new NextResponse(
        "Please set up your bankroll first",
        { status: 400 }
      )
    }

    // Calculate potential win
    const potentialWin = data.stake * data.odds

    const bet = await bettingService.placeBet({
      userId: session.user.id,
      ...data,
      potentialWin,
      status: "pending"
    })

    return NextResponse.json(bet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[BETS_POST]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where = {
      userId: session.user.id,
      ...(status ? { status } : {})
    }

    const [bets, total] = await Promise.all([
      db.placedBet.findMany({
        where,
        orderBy: {
          placedAt: 'desc'
        },
        take: limit,
        skip
      }),
      db.placedBet.count({ where })
    ])

    return NextResponse.json({
      bets,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    })
  } catch (error) {
    console.error("[BETS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}