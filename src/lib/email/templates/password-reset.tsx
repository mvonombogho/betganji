import React from 'react';
import { EmailTemplate } from './email-template';
import { Text } from '@react-email/text';

interface PasswordResetTemplateProps {
  resetLink: string;
}

export function PasswordResetTemplate({ resetLink }: PasswordResetTemplateProps) {
  return (
    <EmailTemplate
      preview="Reset your BetGanji password"
      heading="Reset Your Password"
      body={
        <>
          <Text style={text}>
            Someone requested a password reset for your BetGanji account. 
            If this wasn't you, you can safely ignore this email.
          </Text>
          <Text style={text}>
            To reset your password, click the button below. This link will expire in 1 hour.
          </Text>
        </>
      }
      callToAction={{
        text: 'Reset Password',
        link: resetLink
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
