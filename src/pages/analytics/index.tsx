import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpenseCategoryChart } from './components/expense-category-chart';
import { SubCategoryChart } from './components/sub-category-chart';
import { CashFlowChart } from './components/cash-flow-chart';
import { SummaryStats } from './components/summary-stats';
import { TimeFilter } from './components/time-filter';
import { useTransactions } from '@/hooks/useTransactions';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';

export type TimeRange = '7d' | '30d' | '3m' | '6m' | 'ytd' | 'custom';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const { transactions, loading } = useTransactions();
  const { categories } = useExpenseCategories();

  // Filter out income category and get only expense categories
  const expenseCategories = categories.filter(c => c.id !== 1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Track your spending patterns and financial trends
            </p>
          </div>
          <TimeFilter value={timeRange} onChange={setTimeRange} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart 
              transactions={transactions} 
              timeRange={timeRange} 
            />
          </CardContent>
        </Card>

        <SummaryStats transactions={transactions} timeRange={timeRange} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expense Categories</CardTitle>
              <Select 
                value={selectedCategory?.toString()} 
                onValueChange={(value) => setSelectedCategory(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ExpenseCategoryChart 
                transactions={transactions} 
                timeRange={timeRange} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory 
                  ? `${categories.find(c => c.id === selectedCategory)?.name} Breakdown`
                  : 'Select a category to see subcategories'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SubCategoryChart 
                transactions={transactions} 
                timeRange={timeRange}
                mainCategoryId={selectedCategory}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}