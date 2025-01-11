import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { formatDisplayAmount } from '@/lib/format';
import type { Budget } from '@/types/budgets';

interface BudgetListProps {
  budgets: Budget[];
  loading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export function BudgetList({ budgets, loading, onEdit, onDelete }: BudgetListProps) {
  const { categories } = useExpenseCategories();

  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading budgets...
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No budgets found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.map((budget) => {
            const category = categories.find(c => c.id === budget.mainCategoryId);
            const progressColor = budget.percentageUsed >= 100 
              ? 'bg-destructive' 
              : budget.percentageUsed >= 80 
                ? 'bg-yellow-500' 
                : 'bg-primary';

            return (
              <TableRow key={budget.id}>
                <TableCell>{category?.name}</TableCell>
                <TableCell>{(() => {
                  const { text, className } = formatDisplayAmount(budget.amount);
                  return <span className={className}>{text}</span>;
                })()}</TableCell>
                <TableCell>{(() => {
                  const { text, className } = formatDisplayAmount(budget.spent);
                  return <span className={className}>{text}</span>;
                })()}</TableCell>
                <TableCell>{(() => {
                  const { text, className } = formatDisplayAmount(budget.remaining);
                  return <span className={className}>{text}</span>;
                })()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={budget.percentageUsed} 
                      className="w-[100px]"
                      indicatorClassName={progressColor}
                    />
                    <span className="text-sm text-muted-foreground">
                      {Math.round(budget.percentageUsed)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>From: {format(budget.startDate, 'MMM d, yyyy')}</div>
                    {budget.endDate && (
                      <div>To: {format(budget.endDate, 'MMM d, yyyy')}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(budget)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(budget)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
