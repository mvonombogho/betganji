import { Resend } from 'resend';
import { generateExcelWorkbook } from './excelGenerator';
import { generateCSVReport } from './reportGenerator';
import type { PlacedBet } from '@/types/bet';
import type { EmailReportOptions, EmailTemplate } from '@/types/email';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateEmailHTML(template: EmailTemplate, reportDetails: {
  includeOverview?: boolean;
  includeBookmakers?: boolean;
  includeMonthly?: boolean;
  dateRange?: { start: Date; end: Date };
}) {
  const sections = [
    reportDetails.includeOverview && '✓ Overall Performance',
    reportDetails.includeBookmakers && '✓ Bookmaker Performance',
    reportDetails.includeMonthly && '✓ Monthly Performance',
    '✓ Complete Bet History'
  ].filter(Boolean);

  const dateRangeText = reportDetails.dateRange
    ? `<p>Date Range: ${reportDetails.dateRange.start.toLocaleDateString()} to ${reportDetails.dateRange.end.toLocaleDateString()}</p>`
    : '';

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${template.subject}</h2>
      
      ${template.recipientName ? `<p>Hello ${template.recipientName},</p>` : '<p>Hello,</p>'}
      
      <div style="white-space: pre-line;">${template.message}</div>
      
      <div style="margin: 1.5rem 0;">
        <p>Your report includes:</p>
        <ul style="list-style-type: none; padding: 0;">
          ${sections.map(section => `<li>${section}</li>`).join('')}
        </ul>
      </div>
      
      ${dateRangeText}
      
      <p style="color: #6b7280; font-size: 0.875rem; margin-top: 1.5rem;">
        Note: This report was generated automatically. Please do not reply to this email.
      </p>
      
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 0.75rem;">
          © ${new Date().getFullYear()} BetGanji. All rights reserved.
        </p>
      </div>
    </div>
  `;
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

    // Generate email HTML
    const html = generateEmailHTML(options.template, {
      includeOverview: options.includeOverview,
      includeBookmakers: options.includeBookmakers,
      includeMonthly: options.includeMonthly,
      dateRange: options.dateRange
    });

    // Send email with attachment
    const { data, error } = await resend.emails.send({
      from: 'BetGanji <reports@betganji.com>',
      to: [options.email],
      subject: options.template.subject,
      html,
      attachments: [{
        filename: `${filename}.${options.format === 'excel' ? 'xlsx' : 'csv'}`,
        content: fileContent,
        contentType: mimeType,
      }],
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