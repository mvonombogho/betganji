import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { generateImmediateReport } from '@/lib/queue';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const generateReportSchema = z.object({
  reportType: z.enum(['daily', 'weekly', 'monthly']),
  dateRange: z.object({
    start: z.string().transform(str => new Date(str)),
    end: z.string().transform(str => new Date(str)),
  }).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the last 10 email logs for the user
    const logs = await prisma.emailLog.findMany({
      where: {
        userId: session.user.id,
        type: 'PREDICTION_REPORT',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Failed to fetch report history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { reportType } = generateReportSchema.parse(body);

    // Add to queue with immediate processing
    const job = await generateImmediateReport(session.user.id, reportType);

    // Create a log entry for the request
    await prisma.emailLog.create({
      data: {
        userId: session.user.id,
        type: 'PREDICTION_REPORT',
        status: 'QUEUED',
        metadata: {
          reportType,
          jobId: job.id,
        },
      },
    });

    return NextResponse.json({
      message: 'Report generation started',
      jobId: job.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    console.error('Failed to generate report:', error);

    // Log the error
    if (session?.user) {
      await prisma.emailLog.create({
        data: {
          userId: session.user.id,
          type: 'PREDICTION_REPORT',
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}