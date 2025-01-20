import { 
  subDays, 
  startOfMonth, 
  endOfMonth,
  isAfter,
  isBefore
} from 'date-fns';
import type { Transaction } from '../types/transactions';
import type { TimeRange } from '../types/transactions';

export function filterTransactionsByTimeRange(
  transactions: Transaction[],
  timeRange: TimeRange
): Transaction[] {
  const now = new Date();
  let startDate: Date;
  let endDate: Date | undefined;

  // Handle month range (format: month-YYYY-MM)
  const monthMatch = timeRange.match(/^month-(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const [_, year, month] = monthMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1);
    startDate = startOfMonth(date);
    endDate = endOfMonth(date);
  } else {
    // Handle custom date range (format: custom-YYYY-MM-DD-YYYY-MM-DD)
    const customMatch = timeRange.match(/^custom-(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$/);
    if (customMatch) {
      const [_, start, end] = customMatch;
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      // Fallback to current month if invalid format
      const date = new Date();
      startDate = startOfMonth(date);
      endDate = endOfMonth(date);
    }
  }

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const isAfterStart = isAfter(transactionDate, startDate) || transactionDate.getTime() === startDate.getTime();
    const isBeforeEnd = endDate ? isBefore(transactionDate, endDate) || transactionDate.getTime() === endDate.getTime() : true;
    return isAfterStart && isBeforeEnd;
  });
}
