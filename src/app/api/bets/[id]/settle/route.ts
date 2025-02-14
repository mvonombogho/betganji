import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { status } = data;

    if (!['won', 'lost', 'void'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const bet = await prisma.placedBet.findUnique({
      where: { id: params.id }
    });

    if (!bet) {
      return NextResponse.json(
        { error: 'Bet not found' },
        { status: 404 }
      );
    }

    if (bet.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedBet = await prisma.placedBet.update({
      where: { id: params.id },
      data: {
        status,
        settledAt: new Date(),
        profitLoss: status === 'won' 
          ? bet.potentialWin - bet.stake
          : status === 'lost' 
            ? -bet.stake 
            : 0
      }
    });

    return NextResponse.json(updatedBet);
  } catch (error) {
    console.error('Error settling bet:', error);
    return NextResponse.json(
      { error: 'Failed to settle bet' },
      { status: 500 }
    );
  }
}