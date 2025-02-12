import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const match = await db.match.findUnique({
      where: {
        id: params.id
      },
      include: {
        competition: true,
        homeTeam: true,
        awayTeam: true,
        odds: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 10 // Get last 10 odds updates
        },
        _count: {
          select: {
            predictions: true
          }
        }
      }
    })

    if (!match) {
      return new NextResponse("Match not found", { status: 404 })
    }

    // Get head-to-head stats
    const h2h = await db.match.findMany({
      where: {
        OR: [
          {
            AND: [
              { homeTeamId: match.homeTeamId },
              { awayTeamId: match.awayTeamId }
            ]
          },
          {
            AND: [
              { homeTeamId: match.awayTeamId },
              { awayTeamId: match.homeTeamId }
            ]
          }
        ],
        status: 'finished',
      },
      orderBy: {
        kickoff: 'desc'
      },
      take: 5,
      include: {
        homeTeam: true,
        awayTeam: true,
      }
    })

    // Combine match data with h2h stats
    const matchWithH2h = {
      ...match,
      h2h: {
        matches: h2h,
        stats: {
          totalGames: h2h.length,
          homeWins: h2h.filter(m => 
            (m.homeTeamId === match.homeTeamId && m.score?.homeScore! > m.score?.awayScore!) ||
            (m.awayTeamId === match.homeTeamId && m.score?.awayScore! > m.score?.homeScore!)
          ).length,
          awayWins: h2h.filter(m => 
            (m.homeTeamId === match.awayTeamId && m.score?.homeScore! > m.score?.awayScore!) ||
            (m.awayTeamId === match.awayTeamId && m.score?.awayScore! > m.score?.homeScore!)
          ).length,
          draws: h2h.filter(m => m.score?.homeScore === m.score?.awayScore).length,
        }
      }
    }

    return NextResponse.json(matchWithH2h)
  } catch (error) {
    console.error("[MATCH_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}