import React from 'react';
import { Button } from '@/components/ui/button';

export const ExportButton = ({ data, format = 'csv' }) => {
  const handleExport = async () => {
    // Implementation for data export
  };

  return (
    <Button onClick={handleExport}>
      Export as {format.toUpperCase()}
    </Button>
  );
};