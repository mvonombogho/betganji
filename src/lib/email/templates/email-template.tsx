import React from 'react';
import { Html } from '@react-email/html';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Button } from '@react-email/button';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';

interface EmailTemplateProps {
  preview?: string;
  heading: string;
  body: React.ReactNode;
  callToAction?: {
    text: string;
    link: string;
  };
}

export function EmailTemplate({ 
  preview, 
  heading, 
  body, 
  callToAction 
}: EmailTemplateProps) {
  return (
    <Html>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={logo}>BetGanji</Heading>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Heading style={title}>{heading}</Heading>
          
          {typeof body === 'string' ? (
            <Text style={text}>{body}</Text>
          ) : (
            body
          )}

          {callToAction && (
            <Button 
              href={callToAction.link}
              style={button}
            >
              {callToAction.text}
            </Button>
          )}
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} BetGanji. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

// Styles
const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  backgroundColor: '#f6f9fc',
};

const header = {
  padding: '20px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e6ebf1',
};

const logo = {
  margin: '0',
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#4f46e5',
};

const content = {
  padding: '40px 20px',
  backgroundColor: '#ffffff',
};

const title = {
  margin: '0 0 24px',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const text = {
  margin: '0 0 24px',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4b5563',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const footer = {
  padding: '20px',
  backgroundColor: '#f6f9fc',
  borderTop: '1px solid #e6ebf1',
};

const footerText = {
  margin: '0',
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
};
