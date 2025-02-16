import React from 'react';
import { MatchStatus } from '@prisma/client';

interface MatchStatusBadgeProps {
  status: MatchStatus;
}

export function MatchStatusBadge({ status }: MatchStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'LIVE':
        return 'bg-red-100 text-red-800';
      case 'FINISHED':
        return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
}
