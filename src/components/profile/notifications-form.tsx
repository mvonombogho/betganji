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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorDisplay message={error} className="mb-4" />}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
          Notification settings updated successfully
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Notification Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.email}
                onCheckedChange={() => handleToggle('email')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Push Notifications</label>
                <p className="text-sm text-gray-500">Receive instant updates in browser</p>
              </div>
              <Switch
                checked={settings.push}
                onCheckedChange={() => handleToggle('push')}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Notification Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Odds Updates</label>
                <p className="text-sm text-gray-500">Get notified of significant odds changes</p>
              </div>
              <Switch
                checked={settings.odds}
                onCheckedChange={() => handleToggle('odds')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Prediction Alerts</label>
                <p className="text-sm text-gray-500">Receive new prediction notifications</p>
              </div>
              <Switch
                checked={settings.predictions}
                onCheckedChange={() => handleToggle('predictions')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Match Updates</label>
                <p className="text-sm text-gray-500">Get notified about match starts and results</p>
              </div>
              <Switch
                checked={settings.matches}
                onCheckedChange={() => handleToggle('matches')}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Saving...' : 'Save Notification Settings'}
        </Button>
      </div>
    </form>
  );
};

export default NotificationsForm;
