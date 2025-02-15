import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import { format } from 'date-fns';

interface PredictionSummary {
  totalPredictions: number;
  successRate: number;
  profitLoss: number;
  roi: number;
  period: {
    start: Date;
    end: Date;
  };
}

interface PredictionReportEmailProps {
  username: string;
  summary: PredictionSummary;
  reportUrl: string;
  reportType: 'daily' | 'weekly' | 'monthly';
}

export const PredictionReportEmail = ({
  username,
  summary,
  reportUrl,
  reportType,
}: PredictionReportEmailProps) => {
  const previewText = `Your ${reportType} prediction report is ready. Success rate: ${summary.successRate.toFixed(1)}%`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            Your {reportType} Prediction Report
          </Heading>
          
          <Text style={text}>
            Hi {username},
          </Text>
          
          <Text style={text}>
            Here's your {reportType} prediction performance summary for the period:
            {format(summary.period.start, 'PP')} - {format(summary.period.end, 'PP')}
          </Text>

          <Section style={statsContainer}>
            <Row>
              <Column style={statsColumn}>
                <Text style={statsLabel}>Total Predictions</Text>
                <Text style={statsValue}>{summary.totalPredictions}</Text>
              </Column>
              <Column style={statsColumn}>
                <Text style={statsLabel}>Success Rate</Text>
                <Text style={statsValue}>{summary.successRate.toFixed(1)}%</Text>
              </Column>
            </Row>
            <Row>
              <Column style={statsColumn}>
                <Text style={statsLabel}>Profit/Loss</Text>
                <Text style={statsValue}>
                  {summary.profitLoss >= 0 ? '+' : ''}{summary.profitLoss.toFixed(2)} units
                </Text>
              </Column>
              <Column style={statsColumn}>
                <Text style={statsLabel}>ROI</Text>
                <Text style={statsValue}>
                  {summary.roi >= 0 ? '+' : ''}{summary.roi.toFixed(1)}%
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            View your detailed report online or download it as PDF:
          </Text>

          <Section style={buttonContainer}>
            <a href={reportUrl} style={button}>View Full Report</a>
          </Section>

          <Text style={footer}>
            This is an automated report from BetGanji. You can manage your email preferences in your account settings.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 20px',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const statsContainer = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const statsColumn = {
  padding: '10px',
  textAlign: 'center' as const,
};

const statsLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 5px',
};

const statsValue = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  display: 'inline-block',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  margin: '40px 0 0',
  textAlign: 'center' as const,
};