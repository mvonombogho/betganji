import { Resend } from 'resend';
import { renderAsync } from '@react-email/render';
import { PredictionReportEmail } from '@/components/emails/prediction-report';
import { prisma } from '@/lib/prisma';
import { ExportService } from './export-service';
import { getBaseUrl } from '@/lib/utils';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  private exportService: ExportService;

  constructor() {
    this.exportService = new ExportService();
  }

  async sendPredictionReport(
    userId: string,
    dateRange: { start: Date; end: Date },
    reportType: 'daily' | 'weekly' | 'monthly'
  ) {
    try {
      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          name: true,
        },
      });

      if (!user?.email) {
        throw new Error('User email not found');
      }

      // Get predictions for the period
      const predictions = await prisma.prediction.findMany({
        where: {
          userId,
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
        include: {
          match: {
            select: {
              homeTeam: { select: { name: true } },
              awayTeam: { select: { name: true } },
              status: true,
              result: true,
            },
          },
          bet: {
            select: {
              stake: true,
              profit: true,
            },
          },
        },
      });

      // Generate PDF report
      const pdfBuffer = await this.exportService.generatePredictionReport(
        predictions,
        {
          format: 'pdf',
          dateRange,
          includeAnalytics: true,
        }
      );

      // Upload PDF to storage and get URL
      const reportFileName = `reports/${userId}/${reportType}_${dateRange.start.toISOString()}.pdf`;
      const reportUrl = await this.uploadReport(reportFileName, pdfBuffer);

      // Calculate summary statistics
      const summary = this.calculateSummary(predictions, dateRange);

      // Render email template
      const emailHtml = await renderAsync(
        PredictionReportEmail({
          username: user.name || 'there',
          summary,
          reportUrl,
          reportType,
        })
      );

      // Send email
      await resend.emails.send({
        from: 'BetGanji <reports@betganji.com>',
        to: user.email,
        subject: `Your ${reportType} prediction report is ready`,
        html: emailHtml,
        attachments: [
          {
            filename: `${reportType}_report.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      // Log email sent
      await prisma.emailLog.create({
        data: {
          userId,
          type: 'PREDICTION_REPORT',
          status: 'SENT',
          metadata: {
            reportType,
            dateRange,
            reportUrl,
          },
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to send prediction report:', error);
      
      // Log email error
      await prisma.emailLog.create({
        data: {
          userId,
          type: 'PREDICTION_REPORT',
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            reportType,
            dateRange,
          },
        },
      });

      throw error;
    }
  }

  private calculateSummary(predictions: any[], period: { start: Date; end: Date }) {
    const completedPredictions = predictions.filter(p => p.match.status === 'FINISHED');
    const correctPredictions = completedPredictions.filter(
      p => p.result === p.match.result
    );

    const totalStake = predictions.reduce(
      (sum, p) => sum + (p.bet?.stake || 0),
      0
    );
    const totalProfit = predictions.reduce(
      (sum, p) => sum + (p.bet?.profit || 0),
      0
    );

    return {
      totalPredictions: predictions.length,
      successRate:
        completedPredictions.length > 0
          ? (correctPredictions.length / completedPredictions.length) * 100
          : 0,
      profitLoss: totalProfit,
      roi: totalStake > 0 ? (totalProfit / totalStake) * 100 : 0,
      period,
    };
  }

  private async uploadReport(fileName: string, buffer: Buffer): Promise<string> {
    // TODO: Implement file upload to your preferred storage service
    // For now, we'll return a mock URL
    return `${getBaseUrl()}/reports/${fileName}`;
  }
}