import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const leagues = await prisma.league.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        _count: {
          select: {
            matches: true,
            teams: true
          }
        }
      },
      orderBy: [
        { country: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(leagues);
  } catch (error) {
    console.error('Failed to fetch leagues:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}