import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { reportQueue } from '@/lib/queue';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { jobId } = params;

    // Get the job from the queue
    const job = await reportQueue.getJob(jobId);
    if (!job) {
      return new NextResponse('Job not found', { status: 404 });
    }

    // Get the job state
    const state = await job.getState();

    // Get the log entry for this job
    const log = await prisma.emailLog.findFirst({
      where: {
        userId: session.user.id,
        metadata: {
          path: ['jobId'],
          equals: jobId
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      id: job.id,
      state,
      data: job.data,
      progress: await job.progress(),
      failedReason: job.failedReason,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      log: log ? {
        status: log.status,
        error: log.error,
        createdAt: log.createdAt
      } : null
    });
  } catch (error) {
    console.error('Failed to fetch job status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}