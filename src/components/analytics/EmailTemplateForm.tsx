import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { EmailTemplate } from '@/types/email';

interface EmailTemplateFormProps {
  value: EmailTemplate;
  onChange: (template: EmailTemplate) => void;
}

export default function EmailTemplateForm({ value, onChange }: EmailTemplateFormProps) {
  const handleChange = (field: keyof EmailTemplate, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipientName">Recipient Name (Optional)</Label>
        <Input
          id="recipientName"
          placeholder="Enter recipient's name"
          value={value.recipientName || ''}
          onChange={(e) => handleChange('recipientName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Email Subject</Label>
        <Input
          id="subject"
          placeholder="Enter email subject"
          value={value.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Custom Message</Label>
        <Textarea
          id="message"
          placeholder="Enter a custom message for the email"
          value={value.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}