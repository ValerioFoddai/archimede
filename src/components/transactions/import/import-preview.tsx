import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatDisplayAmount } from '@/lib/format';
import type { TransactionImport } from '@/types/import';

interface ImportPreviewProps {
  transactions: TransactionImport[];
}

export function ImportPreview({ transactions }: ImportPreviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Preview</h3>
        <p className="text-sm text-muted-foreground">
          Showing first {transactions.length} transactions
        </p>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => {
              const amount = formatDisplayAmount(transaction.amount);
              return (
                <TableRow key={index}>
                  <TableCell>
                    {format(transaction.date, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{transaction.merchant}</TableCell>
                  <TableCell className={cn("text-right font-mono", amount.className)}>
                    {amount.text}
                  </TableCell>
                  <TableCell>{transaction.notes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full',
                          transaction.status === 'pending' && 'bg-yellow-500',
                          transaction.status === 'success' && 'bg-green-500',
                          transaction.status === 'error' && 'bg-red-500',
                          transaction.status === 'duplicate' && 'bg-blue-500'
                        )}
                      />
                      <span className="text-sm capitalize">
                        {transaction.status}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
