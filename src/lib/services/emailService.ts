import { Resend } from 'resend';
import { generateExcelWorkbook } from './excelGenerator';
import { generateCSVReport } from './reportGenerator';
import type { PlacedBet } from '@/types/bet';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailReportOptions {
  email: string;
  format: 'excel' | 'csv';
  includeOverview?: boolean;
  includeBookmakers?: boolean;
  includeMonthly?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export async function sendReportByEmail(bets: PlacedBet[], options: EmailReportOptions) {
  try {
    // Generate the report file
    const filename = `betting-report-${new Date().toISOString().split('T')[0]}`;
    let fileContent: Buffer;
    let mimeType: string;

    if (options.format === 'excel') {
      const workbook = generateExcelWorkbook(bets, options);
      fileContent = await workbook.xlsx.writeBuffer();
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else {
      const csv = generateCSVReport(bets, options);
      fileContent = Buffer.from(csv, 'utf-8');
      mimeType = 'text/csv';
    }

    // Format date range for email
    const dateRangeText = options.dateRange 
      ? `<p>Date Range: ${new Date(options.dateRange.start).toLocaleDateString()} to ${new Date(options.dateRange.end).toLocaleDateString()}</p>`
      : '';

    // Send email with attachment
    const { data, error } = await resend.emails.send({
      from: 'BetGanji <reports@betganji.com>',
      to: [options.email],
      subject: 'Your Betting Report',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Betting Report</h2>
          
          <p>Hello,</p>
          
          <p>Please find attached your betting report from BetGanji. The report includes:</p>
          
          <ul style="list-style-type: none; padding: 0;">
            ${options.includeOverview ? '<li>✓ Overall Performance</li>' : ''}
            ${options.includeBookmakers ? '<li>✓ Bookmaker Performance</li>' : ''}
            ${options.includeMonthly ? '<li>✓ Monthly Performance</li>' : ''}
            <li>✓ Complete Bet History</li>
          </ul>
          
          ${dateRangeText}
          
          <p style="color: #6b7280; font-size: 0.875rem;">
            Note: This report was generated automatically. Please do not reply to this email.
          </p>
          
          <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 0.75rem;">
              © ${new Date().getFullYear()} BetGanji. All rights reserved.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${filename}.${options.format === 'excel' ? 'xlsx' : 'csv'}`,
          content: fileContent,
          contentType: mimeType,
        },
      ],
    });

    if (error) {
      throw error;
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending report by email:', error);
    return { success: false, error };
  }
}