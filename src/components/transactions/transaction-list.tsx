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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/transactions';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { useBanks } from '@/hooks/useBanks';
import { useTags } from '@/hooks/useTags';
import { formatDisplayAmount } from '@/lib/format';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, loading, onEdit, onDelete }: TransactionListProps) {
  const { categories } = useExpenseCategories();
  const { banks } = useBanks();
  const { tags } = useTags();

  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const bank = banks.find((b) => b.id === transaction.bankId);
            const mainCategory = categories.find(
              (c) => c.id === transaction.mainCategoryId
            );
            const subCategory = mainCategory?.sub_categories.find(
              (s) => s.id === transaction.subCategoryId
            );
            const transactionTags = tags.filter(
              (tag) => transaction.tagIds?.includes(tag.id)
            );

            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(transaction.date, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{bank?.name}</TableCell>
                <TableCell>{transaction.merchant}</TableCell>
                <TableCell className="text-right">
                  {formatDisplayAmount(transaction.amount)}
                </TableCell>
                <TableCell>
                  {mainCategory && (
                    <div className="space-y-1">
                      <div>{mainCategory.name}</div>
                      {subCategory && (
                        <div className="text-sm text-muted-foreground">
                          {subCategory.name}
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {transactionTags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.notes}
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
                      <DropdownMenuItem onClick={() => onEdit(transaction)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(transaction)}
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
