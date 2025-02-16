import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest } from '@/middleware/api-auth';

const notificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  odds: z.boolean(),
  predictions: z.boolean(),
  matches: z.boolean()
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
    const validatedData = notificationSettingsSchema.parse(body);

    // TODO: Add actual database update
    // This is a placeholder implementation
    console.log('Updating notification settings for user:', userId, validatedData);

    // If push notifications are enabled, register the subscription
    if (validatedData.push) {
      // TODO: Implement push notification subscription
      console.log('Registering push notifications for user:', userId);
    }

    return NextResponse.json({
      message: 'Notification settings updated successfully',
      settings: validatedData
    });

  } catch (error) {
    console.error('Notification settings update error:', error);

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
