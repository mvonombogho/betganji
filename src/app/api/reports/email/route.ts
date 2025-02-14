import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { sendReportByEmail } from '@/lib/services/emailService';
import { z } from 'zod';

const emailReportSchema = z.object({
  email: z.string().email(),
  format: z.enum(['excel', 'csv']),
  includeOverview: z.boolean().optional(),
  includeBookmakers: z.boolean().optional(),
  includeMonthly: z.boolean().optional(),
  dateRange: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str))
  }).optional()
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = emailReportSchema.parse(body);

    // Get user's bets
    const bets = await prisma.placedBet.findMany({
      where: {
        userId: session.user.id,
        ...(validatedData.dateRange ? {
          createdAt: {
            gte: validatedData.dateRange.start,
            lte: validatedData.dateRange.end
          }
        } : {})
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Send email report
    const result = await sendReportByEmail(bets, {
      ...validatedData,
      email: validatedData.email
    });

    if (!result.success) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending email report:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send report' },
      { status: 500 }
    );
  }
}