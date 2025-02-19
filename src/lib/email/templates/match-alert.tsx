import React from 'react';
import { EmailTemplate } from './email-template';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';

interface MatchAlertTemplateProps {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  datetime: string;
  prediction: string;
  confidence: number;
}

export function MatchAlertTemplate({ 
  homeTeam,
  awayTeam,
  competition,
  datetime,
  prediction,
  confidence 
}: MatchAlertTemplateProps) {
  const matchDate = new Date(datetime);
  const matchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/matches/${homeTeam}-vs-${awayTeam}`;

  return (
    <EmailTemplate
      preview={`Upcoming Match: ${homeTeam} vs ${awayTeam}`}
      heading="Match Prediction Alert"
      body={
        <>
          <Section style={matchInfo}>
            <Text style={matchTitle}>
              {homeTeam} vs {awayTeam}
            </Text>
            <Text style={matchDetails}>
              {competition}
              <br />
              {matchDate.toLocaleString()}
            </Text>
          </Section>

          <Section style={predictionSection}>
            <Text style={predictionTitle}>Our Prediction</Text>
            <Text style={predictionText}>
              {prediction}
              <span style={confidenceText}>
                {confidence.toFixed(1)}% confidence
              </span>
            </Text>
          </Section>

          <Text style={text}>
            Click below to view detailed match analysis and betting recommendations.
          </Text>
        </>
      }
      callToAction={{
        text: 'View Match Details',
        link: matchUrl
      }}
    />
  );
}

const text = {
  margin: '0 0 24px',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4b5563',
};

const matchInfo = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
};

const matchTitle = {
  margin: '0 0 8px',
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const matchDetails = {
  margin: '0',
  fontSize: '16px',
  color: '#4b5563',
};

const predictionSection = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#eef2ff',
  borderRadius: '8px',
};

const predictionTitle = {
  margin: '0 0 8px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#4f46e5',
};

const predictionText = {
  margin: '0',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const confidenceText = {
  marginLeft: '8px',
  fontSize: '14px',
  fontWeight: 'normal',
  color: '#6b7280',
};
