import { NextRequest } from 'next/server';
import { MatchService } from '@/lib/data/services/match-service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const matchService = new MatchService();

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get date from query params or use today
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get matches
    const matches = await matchService.getMatches(date);

    // Sync matches to database in the background
    matchService.syncMatchesToDatabase(matches).catch(error => {
      console.error('Background sync failed:', error);
    });

    return Response.json(matches);
  } catch (error) {
    console.error('Error in matches API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function GET_BY_ID(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Match ID is required', { status: 400 });
    }

    const match = await matchService.getMatchById(id);
    
    if (!match) {
      return new Response('Match not found', { status: 404 });
    }

    return Response.json(match);
  } catch (error) {
    console.error('Error in match by ID API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Add rate limiting middleware
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}