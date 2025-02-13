import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { BettingService } from "@/lib/data/services/betting-service"
import { db } from "@/lib/db"
import { z } from "zod"

const bettingService = new BettingService()

interface RouteParams {
  params: {
    id: string
  }
}

const settleBetSchema = z.object({
  status: z.enum(["won", "lost", "void"]),
  result: z.string().optional()
})

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const bet = await db.placedBet.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!bet) {
      return new NextResponse("Bet not found", { status: 404 })
    }

    return NextResponse.json(bet)
  } catch (error) {
    console.error("[BET_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const data = settleBetSchema.parse(json)

    // Verify ownership
    const bet = await db.placedBet.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!bet) {
      return new NextResponse("Bet not found", { status: 404 })
    }

    // Settle the bet
    const updatedBet = await bettingService.settleBet(
      params.id,
      data.status,
      data.result
    )

    return NextResponse.json(updatedBet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[BET_PUT]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Only allow deleting pending bets
    const bet = await db.placedBet.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
        status: "pending"
      }
    })

    if (!bet) {
      return new NextResponse(
        "Bet not found or cannot be deleted", 
        { status: 404 }
      )
    }

    // Delete the bet and update balances
    await bettingService.settleBet(params.id, "void")

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[BET_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}