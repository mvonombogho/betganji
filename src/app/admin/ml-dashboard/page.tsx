import React from 'react';
import { Metadata } from 'next';
import { ModelDashboard } from '@/components/ml/model-dashboard';

export const metadata: Metadata = {
  title: 'Model Training Dashboard | BetGanji',
  description: 'Machine Learning Model Training and Monitoring Dashboard'
};

export default function ModelDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Model Training Dashboard</h1>
      <ModelDashboard />
    </div>
  );
}
