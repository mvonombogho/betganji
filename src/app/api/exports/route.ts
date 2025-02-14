import { NextResponse } from 'next/server';
import { ExportService, ExportOptions } from '@/lib/services/export-service';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { format, dateRange, includeAnalytics } = body as ExportOptions;

    // Fetch predictions for the user
    const predictions = await prisma.prediction.findMany({
      where: {
        userId: session.user.id,
        createdAt: dateRange ? {
          gte: dateRange.start,
          lte: dateRange.end
        } : undefined
      },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true
          }
        }
      }
    });

    const exportService = new ExportService();
    const report = await exportService.generatePredictionReport(predictions, {
      format,
      dateRange,
      includeAnalytics
    });

    // Set appropriate headers based on format
    const headers = new Headers();
    headers.set('Content-Type', format === 'pdf' ? 'application/pdf' : 'text/csv');
    headers.set('Content-Disposition', `attachment; filename=predictions.${format}`);

    return new NextResponse(report, { headers });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Export failed', { status: 500 });
  }
}
