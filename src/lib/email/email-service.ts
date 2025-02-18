import { createTransport } from 'nodemailer';
import { EmailTemplate } from '@/types/email';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: this.getPasswordResetTemplate(resetLink),
    });
  }

  async sendMatchAlert(email: string, matchData: any): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Match Alert: ${matchData.homeTeam} vs ${matchData.awayTeam}`,
      html: this.getMatchAlertTemplate(matchData),
    });
  }

  async sendPredictionResult(email: string, predictionData: any): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your Prediction Results',
      html: this.getPredictionResultTemplate(predictionData),
    });
  }

  private getPasswordResetTemplate(resetLink: string): string {
    return `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;
  }

  private getMatchAlertTemplate(matchData: any): string {
    return `
      <h1>Match Alert</h1>
      <h2>${matchData.homeTeam} vs ${matchData.awayTeam}</h2>
      <p>Date: ${new Date(matchData.datetime).toLocaleString()}</p>
      <p>Competition: ${matchData.competition}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches/${matchData.id}">View Match Details</a>
    `;
  }

  private getPredictionResultTemplate(predictionData: any): string {
    return `
      <h1>Prediction Results</h1>
      <h2>${predictionData.match.homeTeam} vs ${predictionData.match.awayTeam}</h2>
      <p>Your Prediction: ${predictionData.prediction}</p>
      <p>Actual Result: ${predictionData.actualResult}</p>
      <p>Accuracy: ${predictionData.accuracy}%</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/predictions/${predictionData.id}">View Details</a>
    `;
  }
}

export const emailService = new EmailService();