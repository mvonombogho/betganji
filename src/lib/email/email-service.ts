import { Resend } from 'resend';

export type EmailTemplate = 'password-reset' | 'match-alert' | 'prediction-result';

interface EmailOptions {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

export class EmailService {
  private static instance: EmailService;
  private resend: Resend;

  private constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    this.resend = new Resend(apiKey);
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send an email using a template
   */
  async sendEmail(options: EmailOptions) {
    try {
      const html = await this.getTemplateHtml(options.template, options.data);

      await this.resend.emails.send({
        from: 'BetGanji <notifications@betganji.com>',
        to: options.to,
        subject: options.subject,
        html: html
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string, resetToken: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      data: { resetLink }
    });
  }

  /**
   * Send match alert email
   */
  async sendMatchAlert(email: string, matchData: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
    datetime: string;
    prediction: string;
    confidence: number;
  }) {
    return this.sendEmail({
      to: email,
      subject: `Match Alert: ${matchData.homeTeam} vs ${matchData.awayTeam}`,
      template: 'match-alert',
      data: matchData
    });
  }

  /**
   * Send prediction result email
   */
  async sendPredictionResult(email: string, resultData: {
    homeTeam: string;
    awayTeam: string;
    prediction: string;
    result: string;
    wasCorrect: boolean;
    analysis: string;
  }) {
    return this.sendEmail({
      to: email,
      subject: 'Your Prediction Result',
      template: 'prediction-result',
      data: resultData
    });
  }

  private async getTemplateHtml(template: EmailTemplate, data: any): Promise<string> {
    // Templates will be implemented next
    return '';
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
