export interface TransactionImport {
  date: Date;
  merchant: string;
  amount: number;
  notes: string | null;
  status: 'pending' | 'success' | 'error' | 'duplicate';
  errors: string[];
}

export interface ImportSummary {
  total: number;
  successful: number;
  duplicates: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}