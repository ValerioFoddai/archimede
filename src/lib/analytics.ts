import { subDays, subMonths, startOfYear, isAfter } from 'date-fns';
import type { Transaction } from '@/types/transactions';
import type { TimeRange } from '@/pages/analytics';

export function filterTransactionsByTimeRange(
  transactions: Transaction[],
  timeRange: TimeRange
): Transaction[] {
  const now = new Date();
  let startDate: Date;

  switch (timeRange) {
    case '7d':
      startDate = subDays(now, 7);
      break;
    case '30d':
      startDate = subDays(now, 30);
      break;
    case '3m':
      startDate = subMonths(now, 3);
      break;
    case '6m':
      startDate = subMonths(now, 6);
      break;
    case 'ytd':
      startDate = startOfYear(now);
      break;
    case 'custom':
      // For now, default to last 30 days
      startDate = subDays(now, 30);
      break;
    default:
      startDate = subDays(now, 30);
  }

  return transactions.filter(transaction => 
    isAfter(transaction.date, startDate)
  );
}