import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { formatDisplayAmount } from '../../../lib/format';
import { filterTransactionsByTimeRange } from '../../../lib/analytics';
import { useExpenseCategories } from '../../../hooks/useExpenseCategories';
import type { Transaction } from '../../../types/transactions';
import type { TimeRange } from '../../../types/transactions';

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

  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate monthly average based on the time range
  const averageMonthlySpending = calculateAverageMonthlySpending(totalSpending);

  const topCategory = getTopCategory(filteredTransactions, categories);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(() => {
              const { text } = formatDisplayAmount(totalSpending);
              return text;
            })()}
          </div>
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
            {(() => {
              const { text } = formatDisplayAmount(averageMonthlySpending);
              return text;
            })()}
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
            {(() => {
              const { text } = formatDisplayAmount(topCategory.amount);
              return text;
            })()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(() => {
              const { text } = formatDisplayAmount(totalIncome);
              return text;
            })()}
          </div>
          <p className="text-xs text-muted-foreground">For selected period</p>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateAverageMonthlySpending(totalSpending: number): number {
  // For monthly views, the total is already the monthly amount
  return totalSpending;
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
