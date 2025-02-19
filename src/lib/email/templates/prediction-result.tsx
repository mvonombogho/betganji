import React from 'react';
import { EmailTemplate } from './email-template';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';

interface PredictionResultTemplateProps {
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  result: string;
  wasCorrect: boolean;
  analysis: string;
}

export function PredictionResultTemplate({ 
  homeTeam,
  awayTeam,
  prediction,
  result,
  wasCorrect,
  analysis 
}: PredictionResultTemplateProps) {
  const matchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/matches/${homeTeam}-vs-${awayTeam}`;

  return (
    <EmailTemplate
      preview={`Match Result: ${homeTeam} vs ${awayTeam}`}
      heading="Prediction Result"
      body={
        <>
          <Section style={matchInfo}>
            <Text style={matchTitle}>
              {homeTeam} vs {awayTeam}
            </Text>
          </Section>

          <Section style={resultSection(wasCorrect)}>
            <Text style={resultTitle}>
              {wasCorrect ? '✓ Correct Prediction!' : '✗ Incorrect Prediction'}
            </Text>
            
            <div style={resultDetails}>
              <div style={resultRow}>
                <span style={resultLabel}>Your Prediction:</span>
                <span style={resultValue}>{prediction}</span>
              </div>
              <div style={resultRow}>
                <span style={resultLabel}>Actual Result:</span>
                <span style={resultValue}>{result}</span>
              </div>
            </div>
          </Section>

          {analysis && (
            <Section style={analysisSection}>
              <Text style={analysisTitle}>Analysis</Text>
              <Text style={analysisText}>{analysis}</Text>
            </Section>
          )}

          <Text style={text}>
            View detailed match statistics and improve your future predictions by clicking below.
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
  margin: '0',
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  textAlign: 'center' as const,
};

const resultSection = (wasCorrect: boolean) => ({
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: wasCorrect ? '#ecfdf5' : '#fef2f2',
  borderRadius: '8px',
  border: `1px solid ${wasCorrect ? '#34d399' : '#f87171'}`,
});

const resultTitle = {
  margin: '0 0 16px',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
};

const resultDetails = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px',
};

const resultRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
};

const resultLabel = {
  fontSize: '14px',
  color: '#4b5563',
};

const resultValue = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const analysisSection = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
};

const analysisTitle = {
  margin: '0 0 8px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const analysisText = {
  margin: '0',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#4b5563',
};
