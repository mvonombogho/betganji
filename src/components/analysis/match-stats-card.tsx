interface MatchStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MatchStatsCard({
  title,
  value,
  subtitle,
  trend
}: MatchStatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {trend && (
          <span className={`text-sm ${{
            'up': 'text-green-600',
            'down': 'text-red-600',
            'neutral': 'text-gray-600'
          }[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
