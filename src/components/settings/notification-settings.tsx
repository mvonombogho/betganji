import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export function NotificationSettings() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    matchAlerts: true,
    predictionResults: true,
    passwordReset: true,
    emailFrequency: 'instant',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Notification settings updated',
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Email Notifications</h2>
        
        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h3 className="font-medium">Match Alerts</h3>
            <p className="text-sm text-gray-500">Get notified about upcoming matches</p>
          </div>
          <Switch
            checked={settings.matchAlerts}
            onCheckedChange={(checked) => setSettings({ ...settings, matchAlerts: checked })}
          />
        </div>

        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h3 className="font-medium">Prediction Results</h3>
            <p className="text-sm text-gray-500">Receive updates about your prediction outcomes</p>
          </div>
          <Switch
            checked={settings.predictionResults}
            onCheckedChange={(checked) => setSettings({ ...settings, predictionResults: checked })}
          />
        </div>

        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h3 className="font-medium">Password Reset</h3>
            <p className="text-sm text-gray-500">Receive password reset emails</p>
          </div>
          <Switch
            checked={settings.passwordReset}
            onCheckedChange={(checked) => setSettings({ ...settings, passwordReset: checked })}
          />
        </div>

        <div className="space-y-2 py-4">
          <h3 className="font-medium">Email Frequency</h3>
          <Select
            value={settings.emailFrequency}
            onValueChange={(value) => setSettings({ ...settings, emailFrequency: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={updateSettings}
          className="w-full mt-6"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
