import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/auth-context';
import ErrorDisplay from '@/components/ui/error-display';
import { UserPreferences } from '@/types/user';

const PreferencesForm: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultStake: user?.preferences?.defaultStake || 10,
    riskTolerance: user?.preferences?.riskTolerance || 'medium',
    preferredMarkets: user?.preferences?.preferredMarkets || [],
    notifications: {
      email: user?.preferences?.notifications?.email || false,
      push: user?.preferences?.notifications?.push || false,
      odds: user?.preferences?.notifications?.odds || false,
      predictions: user?.preferences?.notifications?.predictions || false
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleStakeChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      defaultStake: parseInt(value) || 10
    }));
    setSuccess(false);
  };

  const handleRiskToleranceChange = (value: 'low' | 'medium' | 'high') => {
    setPreferences(prev => ({
      ...prev,
      riskTolerance: value
    }));
    setSuccess(false);
  };

  const handleNotificationChange = (key: keyof typeof preferences.notifications) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update preferences');
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
          Preferences updated successfully
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Default Stake (Units)
          </label>
          <Select
            value={preferences.defaultStake.toString()}
            onValueChange={handleStakeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select stake" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map(value => (
                <SelectItem key={value} value={value.toString()}>
                  {value} units
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Risk Tolerance
          </label>
          <Select
            value={preferences.riskTolerance}
            onValueChange={handleRiskToleranceChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Notifications</h3>
          <div className="space-y-4">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                </label>
                <Switch
                  checked={value}
                  onCheckedChange={() => handleNotificationChange(key as keyof typeof preferences.notifications)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  );
};

export default PreferencesForm;