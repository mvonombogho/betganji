import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db"
import { Match } from "@/types/match"

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

    // Transform the request to a streaming response
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Function to send updates
    const sendUpdate = async (data: any) => {
      await writer.write(
        encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
      )
    }

    // Initial match data
    const match = await db.match.findUnique({
      where: { id: params.id },
      include: {
        odds: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    })

    if (!match) {
      return new NextResponse("Match not found", { status: 404 })
    }

    // Send initial data
    await sendUpdate({
      type: 'initial',
      data: match
    })

    // Set up real-time updates (simulated here)
    let lastUpdate = Date.now()
    const updateInterval = setInterval(async () => {
      // In a real app, you would fetch real updates from your data source
      // Here we'll simulate some updates
      const now = Date.now()
      
      // Simulate score updates every 15 minutes
      if (now - lastUpdate >= 15 * 60 * 1000) {
        const updatedMatch = await db.match.findUnique({
          where: { id: params.id },
          include: {
            odds: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        })

        if (updatedMatch) {
          await sendUpdate({
            type: 'update',
            data: updatedMatch
          })
          lastUpdate = now
        }
      }
    }, 5000) // Check for updates every 5 seconds

    // Handle client disconnect
    const cleanup = () => {
      clearInterval(updateInterval)
      writer.close()
    }

    // Set up response headers
    const response = new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

    // Handle client disconnect
    response.socket?.on('close', cleanup)

    return response
  } catch (error) {
    console.error("[MATCH_LIVE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}