import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Mail } from 'lucide-react';
import type { NotificationPreferences } from '@/lib/notifications/notification-settings';

interface NotificationPreferencesProps {
  initialPreferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => Promise<void>;
  className?: string;
}

export function NotificationPreferences({
  initialPreferences,
  onSave,
  className = ''
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');

    try {
      await onSave(preferences);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Notification Types */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Match Alerts</span>
                </div>
                <div className="text-sm text-gray-500">
                  Get notified about upcoming matches and predictions
                </div>
              </div>
              <Switch
                checked={preferences.matchAlerts}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, matchAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Prediction Results</span>
                </div>
                <div className="text-sm text-gray-500">
                  Receive updates about your prediction outcomes
                </div>
              </div>
              <Switch
                checked={preferences.predictionResults}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, predictionResults: checked }))
                }
              />
            </div>
          </div>

          {/* Email Frequency */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Email Frequency</span>
            </div>
            
            <Select
              value={preferences.emailFrequency}
              onValueChange={(value: 'instant' | 'daily' | 'weekly') => 
                setPreferences(prev => ({ ...prev, emailFrequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Send immediately</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>

          {/* Status Message */}
          {status === 'success' && (
            <div className="text-sm text-green-600 text-center">
              Preferences saved successfully
            </div>
          )}
          {status === 'error' && (
            <div className="text-sm text-red-600 text-center">
              Failed to save preferences. Please try again.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
