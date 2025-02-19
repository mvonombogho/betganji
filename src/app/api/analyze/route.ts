import { NextRequest } from 'next/server';
import { analyzeBettingOpportunity } from '@/lib/ai/claude';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchInfo } = body;

    if (!matchInfo) {
      return Response.json(
        { error: 'Match information is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeBettingOpportunity(matchInfo);

    return Response.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error during match analysis:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to analyze match' 
      },
      { status: 500 }
    );
  }
}
