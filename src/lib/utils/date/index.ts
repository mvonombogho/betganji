// src/lib/utils/date/index.ts
export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }
  
  export const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date)
  }
  
  export const formatMatchTime = (date: Date): string => {
    return `${formatDate(date)} at ${formatTime(date)}`
  }