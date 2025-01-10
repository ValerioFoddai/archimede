import { useState } from 'react';
import { format } from 'date-fns';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useExpenseCategories } from '../../hooks/useExpenseCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { formatDisplayAmount, formatInputAmount } from '../../lib/format';

// Get current month and year
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

// Generate last 12 months options
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(currentYear, currentMonth - i, 1);
  return {
    value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    label: format(date, 'MMMM yyyy')
  };
});

export function BudgetsPage() {
  const { categories } = useExpenseCategories();
  const { budgets, createBudget, updateBudget } = useBudgets();
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);

  // Filter out income category and get only expense categories
  const expenseCategories = categories.filter(c => c.id !== 1);

  const handleStartEdit = (categoryId: number, currentAmount?: number) => {
    setEditingCategory(categoryId);
    setEditValue(currentAmount?.toString() || '');
  };

  const handleSaveBudget = async (categoryId: number) => {
    if (!editValue) return;

    const existingBudget = budgets.find(b => b.mainCategoryId === categoryId);
    const budgetData = {
      mainCategoryId: categoryId,
      amount: editValue,
      recurring: true,
      startDate: new Date(),
    };

    if (existingBudget) {
      await updateBudget(existingBudget.id, budgetData);
    } else {
      await createBudget(budgetData);
    }

    setEditingCategory(null);
    setEditValue('');
  };

  // Parse selected month
  const [year, month] = selectedMonth.split('-').map(Number);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
            <p className="text-muted-foreground">
              Set monthly spending limits for each category
            </p>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Current Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead className="w-[500px]">Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseCategories.map((category) => {
                const budget = budgets.find(b => b.mainCategoryId === category.id);
                
                // Filter spending for selected month
                const monthlySpent = budget?.spent || 0;
                const monthlyPercentage = budget ? (monthlySpent / budget.amount) * 100 : 0;
                
                const progressColor = monthlyPercentage >= 100 
                  ? 'bg-destructive' 
                  : monthlyPercentage >= 80 
                    ? 'bg-yellow-500' 
                    : 'bg-primary';

                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {editingCategory === category.id ? (
                        <div className="relative w-[150px]">
                          <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => {
                              const formatted = formatInputAmount(e.target.value);
                              if (formatted !== null) {
                                setEditValue(formatted);
                              }
                            }}
                            className="pr-8"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveBudget(category.id);
                              } else if (e.key === 'Escape') {
                                setEditingCategory(null);
                              }
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">€</span>
                        </div>
                      ) : (
                        budget?.amount ? formatDisplayAmount(budget.amount) : '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {budget ? formatDisplayAmount(monthlySpent) : '-'}
                    </TableCell>
                    <TableCell>
                      {budget && (
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={monthlyPercentage} 
                            className="w-[400px]"
                            indicatorClassName={progressColor}
                          />
                          <span className="text-sm text-muted-foreground">
                            {Math.round(monthlyPercentage)}%
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCategory === category.id ? (
                        <div className="space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveBudget(category.id)}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingCategory(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEdit(category.id, budget?.amount)}
                        >
                          {budget ? 'Edit' : 'Set Budget'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
