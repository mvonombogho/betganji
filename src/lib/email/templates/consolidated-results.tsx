import React from 'react';
import { EmailTemplate } from './email-template';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';

interface PredictionResult {
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  result: string;
  wasCorrect: boolean;
}

interface ConsolidatedResultsTemplateProps {
  results: PredictionResult[];
  frequency: 'daily' | 'weekly';
}

export function ConsolidatedResultsTemplate({ 
  results, 
  frequency 
}: ConsolidatedResultsTemplateProps) {
  const periodText = frequency === 'daily' ? "Today's" : "This Week's";
  const correctPredictions = results.filter(r => r.wasCorrect).length;
  const accuracy = (correctPredictions / results.length) * 100;

  return (
    <EmailTemplate
      preview={`${periodText} Prediction Results`}
      heading={`${periodText} Results Summary`}
      body={
        <>
          <Section style={summaryBox}>
            <Text style={summaryText}>
              {correctPredictions} correct out of {results.length} predictions
              <br />
              <span style={accuracyText}>
                {accuracy.toFixed(1)}% accuracy
              </span>
            </Text>
          </Section>

          {results.map((result, index) => (
            <Section key={index} style={resultBox(result.wasCorrect)}>
              <Text style={matchTitle}>
                {result.homeTeam} vs {result.awayTeam}
              </Text>
              <div style={resultInfo}>
                <Text style={predictionText}>
                  Prediction: {result.prediction}
                </Text>
                <Text style={resultText}>
                  Result: {result.result}
                </Text>
              </div>
            </Section>
          ))}
        </>
      }
    />
  );
}

const summaryBox = {
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const summaryText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0',
};

const accuracyText = {
  color: '#4f46e5',
};

const resultBox = (wasCorrect: boolean) => ({
  padding: '16px',
  backgroundColor: wasCorrect ? '#ecfdf5' : '#fef2f2',
  borderRadius: '8px',
  marginBottom: '16px',
});

const matchTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 8px 0',
};

const resultInfo = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
};

const predictionText = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0',
};

const resultText = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0',
};
