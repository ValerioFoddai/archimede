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
import { Checkbox } from '@/components/ui/checkbox';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { useTags } from '@/hooks/useTags';
import { formatDisplayAmount } from '@/lib/format';
import type { Transaction } from '@/types/transactions';
import { useColumnPreferences } from '@/hooks/useColumnPreferences';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  selectedIds: string[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onSelectTransaction: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
}

export function TransactionList({ 
  transactions, 
  loading, 
  selectedIds,
  onEdit, 
  onDelete,
  onSelectTransaction,
  onSelectAll,
  onBulkDelete,
}: TransactionListProps) {
  const { columnVisibility, isLoading: preferencesLoading } = useColumnPreferences();
  const { categories } = useExpenseCategories();
  const { tags } = useTags();

  if (loading || preferencesLoading) {
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
    <div className="-mx-6 relative">
      <div className="border-x bg-background relative">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedIds.length === transactions.length}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              {columnVisibility.category && <TableHead>Category</TableHead>}
              {columnVisibility.tags && <TableHead>Tags</TableHead>}
              {columnVisibility.notes && <TableHead>Notes</TableHead>}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
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
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={(checked) => 
                        onSelectTransaction(transaction.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <>
                    <TableCell>
                      {format(transaction.date, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{transaction.merchant}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const { text, className } = formatDisplayAmount(transaction.amount);
                        return <span className={className}>{text}</span>;
                      })()}
                    </TableCell>
                    {columnVisibility.category && (
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
                    )}
                    {columnVisibility.tags && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {transactionTags.map((tag) => (
                            <Badge key={tag.id} variant="secondary">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.notes && (
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.notes}
                      </TableCell>
                    )}
                  </>
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

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
          <div className="container flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedIds.length} transaction{selectedIds.length === 1 ? '' : 's'} selected
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
