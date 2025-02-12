import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const competition = searchParams.get("competition")
    const date = searchParams.get("date")

    // Build the where clause for the query
    const where = {
      ...(status ? { status } : {}),
      ...(competition ? { competitionId: competition } : {}),
      ...(date ? {
        kickoff: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        }
      } : {})
    }

    const matches = await db.match.findMany({
      where,
      include: {
        competition: true,
        homeTeam: true,
        awayTeam: true,
        odds: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      },
      orderBy: [
        {
          kickoff: 'asc'
        }
      ]
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error("[MATCHES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}