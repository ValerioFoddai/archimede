export function formatDisplayAmount(amount: number): { text: string; className: string } {
  const formattedAmount = amount.toFixed(2);
  const text = `${formattedAmount} €`;
  const className = amount >= 0 ? 'text-green-600 dark:text-green-500' : '';
  return { text, className };
}

export function formatInputAmount(value: string): string | null {
  // Remove any non-numeric characters except decimal point and minus sign
  let cleaned = value.replace(/[^\d.-]/g, '');
  
  // Handle multiple decimal points
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Handle multiple minus signs
  if (cleaned.startsWith('-')) {
    cleaned = '-' + cleaned.substring(1).replace(/-/g, '');
  } else {
    cleaned = cleaned.replace(/-/g, '');
  }
  
  // Limit decimal places to 2
  if (parts[1]?.length > 2) {
    cleaned = parts[0] + '.' + parts[1].slice(0, 2);
  }

  // Validate the final number
  if (!/^-?\d*\.?\d{0,2}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}
