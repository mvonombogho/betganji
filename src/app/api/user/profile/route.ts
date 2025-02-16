import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest } from '@/middleware/api-auth';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional()
});

export async function PUT(req: NextRequest) {
  try {
    // Get user ID from authenticated request
    const { userId } = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validatedData = profileSchema.parse(body);

    // TODO: Add actual database update
    // This is a placeholder implementation
    console.log('Updating profile for user:', userId, validatedData);

    // Check for duplicate email
    if (validatedData.email !== 'current@email.com') { // Replace with actual check
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: userId,
        ...validatedData
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);

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
