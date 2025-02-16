import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest } from '@/middleware/api-auth';

const notificationsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  odds: z.boolean(),
  predictions: z.boolean()
});

const preferencesSchema = z.object({
  defaultStake: z.number().min(1).max(1000),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  preferredMarkets: z.array(z.string()),
  notifications: notificationsSchema
});

export async function PUT(req: NextRequest) {
  try {
    const { userId } = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = preferencesSchema.parse(body);

    // TODO: Add actual database update
    console.log('Updating preferences for user:', userId, validatedData);

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: validatedData
    });

  } catch (error) {
    console.error('Preferences update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
