export function formatDisplayAmount(amount: number): string {
  const formattedAmount = amount.toFixed(2);
  return `${formattedAmount} €`;
}

export function formatInputAmount(value: string): string {
  // Remove any non-numeric characters except decimal point and minus sign
  let cleaned = value.replace(/[^\d.-]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Ensure only one minus sign at the start
  if (cleaned.startsWith('-')) {
    cleaned = '-' + cleaned.substring(1).replace(/-/g, '');
  } else {
    cleaned = cleaned.replace(/-/g, '');
  }
  
  // Limit decimal places to 2
  if (parts[1]?.length > 2) {
    cleaned = parts[0] + '.' + parts[1].slice(0, 2);
  }
  
  return cleaned;
}