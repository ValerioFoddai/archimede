import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { TransactionImport } from '@/types/import';

interface ImportSummaryProps {
  transactions: TransactionImport[];
}

export function ImportSummary({ transactions }: ImportSummaryProps) {
  const total = transactions.length;
  const successful = transactions.filter(t => t.status === 'success').length;
  const duplicates = transactions.filter(t => t.status === 'duplicate').length;
  const failed = transactions.filter(t => t.status === 'error').length;
  const pending = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Complete</CardTitle>
          <CardDescription>
            {successful > 0 
              ? `Successfully imported ${successful} out of ${total} transactions`
              : 'No transactions were imported'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{successful}</div>
                <div className="text-sm text-muted-foreground">Imported</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{duplicates}</div>
                <div className="text-sm text-muted-foreground">Duplicates</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {failed > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {failed} transaction{failed === 1 ? '' : 's'} failed to import.
            Please check the data and try again.
          </AlertDescription>
        </Alert>
      )}

      {duplicates > 0 && (
        <Alert>
          <AlertDescription>
            {duplicates} transaction{duplicates === 1 ? ' was' : 's were'} skipped because {duplicates === 1 ? 'it was' : 'they were'} already imported.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button asChild>
          <Link to="/transactions">View Transactions</Link>
        </Button>
      </div>
    </div>
  );
}