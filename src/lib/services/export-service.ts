import { PDFDocument, rgb } from 'pdf-lib';
import { format } from 'date-fns';
import { Prediction, Match, User } from '@prisma/client';

export interface ExportOptions {
  format: 'pdf' | 'csv';
  dateRange?: { start: Date; end: Date };
  includeAnalytics?: boolean;
  customTemplate?: string;
}

export class ExportService {
  async generatePredictionReport(predictions: Prediction[], options: ExportOptions): Promise<Buffer> {
    if (options.format === 'pdf') {
      return this.generatePDFReport(predictions, options);
    } else {
      return this.generateCSVReport(predictions, options);
    }
  }

  private async generatePDFReport(predictions: Prediction[], options: ExportOptions): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add header
    page.drawText('Prediction Report', {
      x: 50,
      y: height - 50,
      size: 20,
    });

    // Add date range
    if (options.dateRange) {
      const dateRangeText = `${format(options.dateRange.start, 'PP')} - ${format(options.dateRange.end, 'PP')}`;
      page.drawText(dateRangeText, {
        x: 50,
        y: height - 80,
        size: 12,
      });
    }

    // Add predictions
    let yOffset = height - 120;
    for (const prediction of predictions) {
      const predictionText = `${prediction.match.homeTeam.name} vs ${prediction.match.awayTeam.name}: ${prediction.result}`;
      page.drawText(predictionText, {
        x: 50,
        y: yOffset,
        size: 12,
      });
      yOffset -= 20;
    }

    // Add analytics if requested
    if (options.includeAnalytics) {
      const successRate = this.calculateSuccessRate(predictions);
      page.drawText(`Success Rate: ${successRate}%`, {
        x: 50,
        y: 50,
        size: 14,
      });
    }

    return Buffer.from(await pdfDoc.save());
  }

  private async generateCSVReport(predictions: Prediction[], options: ExportOptions): Promise<Buffer> {
    const headers = ['Date', 'Match', 'Prediction', 'Confidence', 'Result'];
    const rows = predictions.map(p => [
      format(p.createdAt, 'PP'),
      `${p.match.homeTeam.name} vs ${p.match.awayTeam.name}`,
      p.result,
      `${p.confidence}%`,
      p.match.status === 'FINISHED' ? p.match.result : 'Pending'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return Buffer.from(csv);
  }

  private calculateSuccessRate(predictions: Prediction[]): number {
    const completedPredictions = predictions.filter(p => p.match.status === 'FINISHED');
    const correctPredictions = completedPredictions.filter(p => p.result === p.match.result);
    return Math.round((correctPredictions.length / completedPredictions.length) * 100);
  }
}
