import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TransactionImport } from '@/types/import';

interface ImportSummaryProps {
  transactions: TransactionImport[];
}

export function ImportSummary({ transactions }: ImportSummaryProps) {
  const successful = transactions.filter(t => t.status === 'success').length;
  const duplicates = transactions.filter(t => t.status === 'duplicate').length;
  const failed = transactions.filter(t => t.status === 'error').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Summary</CardTitle>
          <CardDescription>
            Overview of imported transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
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
    </div>
  );
}