import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDisplayAmount } from '@/lib/format';
import { filterTransactionsByTimeRange } from '@/lib/analytics';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import type { Transaction } from '@/types/transactions';
import type { TimeRange } from '../index';

interface SummaryStatsProps {
  transactions: Transaction[];
  timeRange: TimeRange;
}

export function SummaryStats({ transactions, timeRange }: SummaryStatsProps) {
  const { categories } = useExpenseCategories();
  const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
  
  const totalSpending = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const averageMonthlySpending = totalSpending / (timeRange === '7d' ? 0.25 : 
    timeRange === '30d' ? 1 : 
    timeRange === '3m' ? 3 : 
    timeRange === '6m' ? 6 : 12);

  const topCategory = getTopCategory(filteredTransactions, categories);
  
  const monthOverMonthChange = calculateMonthOverMonthChange(transactions);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDisplayAmount(totalSpending)}</div>
          <p className="text-xs text-muted-foreground">
            For selected period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDisplayAmount(averageMonthlySpending)}
          </div>
          <p className="text-xs text-muted-foreground">Per month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCategory.name}</div>
          <p className="text-xs text-muted-foreground">
            {formatDisplayAmount(topCategory.amount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthOverMonthChange > 0 ? '+' : ''}{monthOverMonthChange}%
          </div>
          <p className="text-xs text-muted-foreground">From last month</p>
        </CardContent>
      </Card>
    </div>
  );
}

function getTopCategory(transactions: Transaction[], categories: any[]) {
  // Filter out income transactions and create category spending map
  const categorySpending = transactions
    .filter(t => t.amount < 0 && t.mainCategoryId) // Only include expenses with a category
    .reduce((acc, t) => {
      if (t.mainCategoryId) {
        acc[t.mainCategoryId] = (acc[t.mainCategoryId] || 0) + Math.abs(t.amount);
      }
      return acc;
    }, {} as Record<number, number>);

  // Find the category with the highest spending
  let maxAmount = 0;
  let topCategoryId: number | null = null;

  Object.entries(categorySpending).forEach(([categoryId, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategoryId = Number(categoryId);
    }
  });

  // Find the category name
  const categoryName = topCategoryId 
    ? categories.find(c => c.id === topCategoryId)?.name || 'Unknown'
    : 'No expenses';

  return {
    name: categoryName,
    amount: maxAmount,
  };
}

function calculateMonthOverMonthChange(transactions: Transaction[]): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Get current month's spending
  const currentMonthSpending = transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             t.amount < 0;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Get last month's spending
  const lastMonthSpending = transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === lastMonth && 
             date.getFullYear() === lastMonthYear && 
             t.amount < 0;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Calculate percentage change
  if (lastMonthSpending === 0) return 0;
  const change = ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;
  return Math.round(change);
}