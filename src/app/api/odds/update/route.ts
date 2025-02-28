import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Update Odds API endpoint
 * Updates or creates odds data in the database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { odds } = body;
    
    if (!odds || !Array.isArray(odds) || odds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid odds data provided' },
        { status: 400 }
      );
    }
    
    // Create or update each odds entry
    const updatedOdds = await Promise.all(
      odds.map(async (odd) => {
        // Check if odds already exist for this match and provider at this timestamp
        const existingOdds = await prisma.odds.findFirst({
          where: {
            matchId: odd.matchId,
            provider: odd.provider,
            timestamp: odd.timestamp
          }
        });
        
        if (existingOdds) {
          // Update existing odds
          return prisma.odds.update({
            where: {
              id: existingOdds.id
            },
            data: {
              homeWin: odd.homeWin,
              draw: odd.draw,
              awayWin: odd.awayWin,
              timestamp: odd.timestamp,
            }
          });
        } else {
          // Create new odds
          return prisma.odds.create({
            data: {
              matchId: odd.matchId,
              provider: odd.provider,
              homeWin: odd.homeWin,
              draw: odd.draw,
              awayWin: odd.awayWin,
              timestamp: odd.timestamp,
            }
          });
        }
      })
    );
    
    return NextResponse.json(updatedOdds, { status: 200 });
  } catch (error) {
    console.error('Error updating odds:', error);
    return NextResponse.json(
      { error: 'Failed to update odds' },
      { status: 500 }
    );
  }
}
