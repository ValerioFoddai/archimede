import { 
  subDays, 
  startOfMonth, 
  endOfMonth,
  isAfter,
  isBefore
} from 'date-fns';
import type { Transaction } from '../types/transactions';
import type { TimeRange } from '../pages/analytics';

export function filterTransactionsByTimeRange(
  transactions: Transaction[],
  timeRange: TimeRange
): Transaction[] {
  const now = new Date();
  let startDate: Date;
  let endDate: Date | undefined;

  if (timeRange === '7d') {
    startDate = subDays(now, 7);
  } else if (timeRange.startsWith('month-')) {
    // Parse month range (format: month-YYYY-MM)
    const [, year, month] = timeRange.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    startDate = startOfMonth(date);
    endDate = endOfMonth(date);
  } else {
    // Default to last 7 days if unknown time range
    startDate = subDays(now, 7);
  }

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const isAfterStart = isAfter(transactionDate, startDate) || transactionDate.getTime() === startDate.getTime();
    const isBeforeEnd = endDate ? isBefore(transactionDate, endDate) || transactionDate.getTime() === endDate.getTime() : true;
    return isAfterStart && isBeforeEnd;
  });
}
