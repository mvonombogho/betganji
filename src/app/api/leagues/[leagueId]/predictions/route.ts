import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { leagueId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const predictions = await prisma.prediction.findMany({
      where: {
        userId: session.user.id,
        match: {
          leagueId: params.leagueId,
          datetime: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          },
        },
      },
      include: {
        match: {
          select: {
            datetime: true,
            status: true,
            result: true,
            homeTeam: {
              select: {
                name: true,
              },
            },
            awayTeam: {
              select: {
                name: true,
              },
            },
          },
        },
        bet: {
          select: {
            stake: true,
            odds: true,
            status: true,
            profit: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Transform predictions to include bet information
    const formattedPredictions = predictions.map(prediction => ({
      id: prediction.id,
      match: prediction.match,
      result: prediction.result,
      confidence: prediction.confidence,
      reasoning: prediction.reasoning,
      stake: prediction.bet?.stake,
      odds: prediction.bet?.odds,
      profit: prediction.bet?.profit,
      createdAt: prediction.createdAt,
    }));

    // Get total count for pagination
    const total = await prisma.prediction.count({
      where: {
        userId: session.user.id,
        match: {
          leagueId: params.leagueId,
          datetime: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          },
        },
      },
    });

    return NextResponse.json({
      predictions: formattedPredictions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch league predictions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}