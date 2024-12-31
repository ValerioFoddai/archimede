export function validateAmount(amount: string): boolean {
  // Remove any non-digit characters except decimal point
  const cleaned = amount.replace(/[^\d.]/g, '');
  
  // Check if it's a valid number with up to 2 decimal places
  const regex = /^\d+(\.\d{0,2})?$/;
  if (!regex.test(cleaned)) return false;
  
  // Check if the amount is greater than 0
  const value = parseFloat(cleaned);
  return value > 0;
}

export function validateDate(date: Date): boolean {
  const now = new Date();
  const min = new Date('1900-01-01');
  
  return date >= min && date <= now;
}