import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ErrorDisplay from '@/components/ui/error-display';
import { useAuth } from '@/contexts/auth-context';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  odds: boolean;
  predictions: boolean;
  matches: boolean;
}

const NotificationsForm: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: user?.preferences?.notifications?.email || false,
    push: user?.preferences?.notifications?.push || false,
    odds: user?.preferences?.notifications?.odds || false,
    predictions: user?.preferences?.notifications?.predictions || false,
    matches: user?.preferences?.notifications?.matches || false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
