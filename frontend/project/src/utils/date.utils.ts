/**
 * Date utility functions
 */

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format a time string to a human-readable format
 */
export const formatTime = (timeString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  
  // Parse the time string (format: "13:00:00Z")
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  
  return date.toLocaleTimeString(undefined, options);
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (dateString: string, timeString?: string): boolean => {
  const dateTime = timeString 
    ? new Date(`${dateString}T${timeString}`) 
    : new Date(dateString);
    
  return dateTime < new Date();
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (dateString: string, timeString?: string): string => {
  const dateTime = timeString 
    ? new Date(`${dateString}T${timeString}`) 
    : new Date(dateString);
    
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diffInMs = dateTime.getTime() - now.getTime();
  
  // Convert to appropriate unit
  const diffInSeconds = Math.round(diffInMs / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);
  
  if (Math.abs(diffInDays) >= 1) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInHours) >= 1) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInMinutes) >= 1) {
    return rtf.format(diffInMinutes, 'minute');
  } else {
    return rtf.format(diffInSeconds, 'second');
  }
};