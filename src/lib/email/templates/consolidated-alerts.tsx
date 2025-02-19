import React from 'react';
import { EmailTemplate } from './email-template';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';

interface Match {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  datetime: string;
  prediction?: string;
  confidence?: number;
}

interface ConsolidatedAlertsTemplateProps {
  matches: Match[];
  frequency: 'daily' | 'weekly';
}

export function ConsolidatedAlertsTemplate({ 
  matches, 
  frequency 
}: ConsolidatedAlertsTemplateProps) {
  const periodText = frequency === 'daily' ? "Today's" : "This Week's";

  return (
    <EmailTemplate
      preview={`${periodText} Match Alerts`}
      heading={`${periodText} Matches`}
      body={
        <>
          <Text style={text}>
            Here are your upcoming matches {frequency === 'daily' ? 'today' : 'this week'}:
          </Text>

          {matches.map((match, index) => (
            <Section key={index} style={matchCard}>
              <Text style={matchTitle}>
                {match.homeTeam} vs {match.awayTeam}
              </Text>
              
              <Text style={matchDetails}>
                {match.competition}
                <br />
                {new Date(match.datetime).toLocaleString()}
              </Text>

              {match.prediction && (
                <Section style={predictionSection}>
                  <Text style={predictionText}>
                    Your Prediction: {match.prediction}
                    {match.confidence && (
                      <span style={confidenceText}>
                        {match.confidence.toFixed(1)}% confidence
                      </span>
                    )}
                  </Text>
                </Section>
              )}
            </Section>
          ))}

          <Text style={text}>
            Click below to view all your upcoming matches and predictions.
          </Text>
        </>
      }
      callToAction={{
        text: 'View All Matches',
        link: `${process.env.NEXT_PUBLIC_APP_URL}/matches`
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

const matchCard = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
};

const matchTitle = {
  margin: '0 0 8px',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const matchDetails = {
  margin: '0 0 16px',
  fontSize: '14px',
  color: '#4b5563',
};

const predictionSection = {
  padding: '12px',
  backgroundColor: '#eef2ff',
  borderRadius: '4px',
};

const predictionText = {
  margin: '0',
  fontSize: '14px',
  color: '#4f46e5',
};

const confidenceText = {
  marginLeft: '8px',
  fontSize: '12px',
  color: '#6b7280',
};
