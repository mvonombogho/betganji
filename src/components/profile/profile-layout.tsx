import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

interface ProfileLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, activeTab }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-6">
        <TabsList className="w-full border-b">
          <TabsTrigger value="profile" className="px-4 py-2">
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="px-4 py-2">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="px-4 py-2">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-4 py-2">
            Notifications
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          {children}
        </Card>
      </Tabs>
    </div>
  );
};

export default ProfileLayout;