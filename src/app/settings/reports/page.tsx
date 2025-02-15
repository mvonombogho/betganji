'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ReportPreferencesForm } from '@/components/reports/report-preferences-form';
import { GenerateReportDialog } from '@/components/reports/generate-report-dialog';
import { ReportHistory } from '@/components/reports/report-history';

export default function ReportsSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Reports Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your report preferences and generation settings
        </p>
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">Reports</h3>
          <p className="text-sm text-muted-foreground">
            View and manage your prediction reports
          </p>
        </div>
        <GenerateReportDialog />
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <ReportHistory />
        </TabsContent>
        <TabsContent value="preferences" className="space-y-4">
          <div className="md:max-w-2xl">
            <ReportPreferencesForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}