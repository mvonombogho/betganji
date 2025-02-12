import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createPredictionSchema = z.object({
  matchId: z.string(),
  type: z.enum(["match_result", "over_under", "both_teams_to_score"]),
  prediction: z.string(),
  odds: z.number(),
  stake: z.number().optional(),
  confidence: z.number().min(1).max(100),
  analysis: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = createPredictionSchema.parse(json)

    const prediction = await db.prediction.create({
      data: {
        ...body,
        userId: session.user.id,
        status: "pending",
      },
    })

    return NextResponse.json(prediction)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    return new NextResponse("Internal error", { status: 500 })
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

    const predictions = await db.prediction.findMany({
      where: {
        userId: session.user.id,
        ...(status ? { status } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("[PREDICTIONS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}