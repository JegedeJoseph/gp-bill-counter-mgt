/**
 * Get a stable date string that will be consistent between server and client
 * @param date Optional date to format, defaults to current date
 * @returns Formatted date string
 */
export function getStableDate(date?: Date): string {
  const dateToUse = date || new Date();
  return dateToUse.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Format a date for display
 * @param dateString ISO date string
 * @returns Formatted date for display
 */
export function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}