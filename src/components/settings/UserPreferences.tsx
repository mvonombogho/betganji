import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export const UserPreferences = () => {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold'>Notification Preferences</h2>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span>Email Notifications</span>
          <Switch />
        </div>
        <div className='flex items-center justify-between'>
          <span>Push Notifications</span>
          <Switch />
        </div>
      </div>
      <Button>Save Preferences</Button>
    </div>
  );
}