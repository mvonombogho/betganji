import { H2HForm } from '@/types/h2h';

interface TeamFormProps {
  form: H2HForm;
  teamName: string;
}

export function TeamForm({ form, teamName }: TeamFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{teamName}</span>
        <span className="text-xs text-gray-500">
          Last {form.lastFiveResults.length} matches
        </span>
      </div>

      <div className="flex gap-2">
        {form.lastFiveResults.map((result, index) => (
          <div
            key={index}
            className={`
              w-8 h-8 rounded-full 
              flex items-center justify-center 
              text-sm font-medium
              ${getFormBadgeStyle(result)}
            `}
          >
            {result}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Goals Scored:</span>
          <span className="ml-1 font-medium">
            {form.averageGoalsScored.toFixed(1)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Clean Sheets:</span>
          <span className="ml-1 font-medium">{form.cleanSheets}</span>
        </div>
      </div>
    </div>
  );
}

function getFormBadgeStyle(result: string): string {
  switch (result) {
    case 'W':
      return 'bg-green-100 text-green-700';
    case 'D':
      return 'bg-yellow-100 text-yellow-700';
    case 'L':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
