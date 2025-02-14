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

    const matches = await prisma.match.findMany({
      where: {
        leagueId: params.leagueId,
        datetime: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
          },
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
          },
        },
        predictions: {
          where: {
            userId: session.user.id,
          },
          select: {
            result: true,
            confidence: true,
          },
        },
        odds: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
          select: {
            homeWin: true,
            draw: true,
            awayWin: true,
          },
        },
      },
      orderBy: {
        datetime: 'desc',
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Failed to fetch league matches:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}