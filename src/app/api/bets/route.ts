import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { selections, stake } = data;

    // Calculate total odds and potential win
    const totalOdds = selections.reduce((acc: number, bet: any) => acc * bet.odds, 1);
    const potentialWin = totalOdds * stake;

    // Create multi-bet with selections
    const multiBet = await prisma.multiBet.create({
      data: {
        userId: session.user.id,
        totalOdds,
        stake,
        potentialWin,
        status: 'pending',
        selections: {
          create: selections.map((selection: any) => ({
            matchId: selection.matchId,
            selection: selection.selection,
            odds: selection.odds,
            status: 'pending'
          }))
        }
      },
      include: {
        selections: true
      }
    });

    return NextResponse.json(multiBet);
  } catch (error) {
    console.error('Error creating bet:', error);
    return NextResponse.json(
      { error: 'Failed to create bet' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = {
      userId: session.user.id,
      ...(status ? { status } : {})
    };

    const bets = await prisma.multiBet.findMany({
      where,
      include: {
        selections: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(bets);
  } catch (error) {
    console.error('Error fetching bets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bets' },
      { status: 500 }
    );
  }
}