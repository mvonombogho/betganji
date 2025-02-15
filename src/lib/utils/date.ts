export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  // Format date
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  // Format time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} at ${formattedTime}`;
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  };

  return date.toLocaleDateString('en-US', options);
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
}

export function getDateRange(days: number): { start: string; end: string } {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}