
/**
 * Format a date object to a string in the format "DD.MM.YYYY"
 */
export const formatDate = (date: Date): string => {
  // Ensure we're working with a Date object
  const dateObj = new Date(date);
  
  // Get day, month, and year with leading zeros where needed
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
  const year = dateObj.getFullYear();
  
  // Return formatted date
  return `${day}.${month}.${year}`;
};

/**
 * Format a number as currency (PLN)
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} zł`;
};
