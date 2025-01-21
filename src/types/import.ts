export interface TransactionImport {
  date: Date;
  merchant: string;
  amount: number;
  notes: string | null;
  status: 'pending' | 'success' | 'error' | 'duplicate';
  errors: string[];
  bank_id?: string;
  bank_account_id?: string;
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

export interface ImportMapping {
  id: string;
  name: string;
  dateFormat: string;
  columnMappings: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ImportConfig {
  columnMappings: Record<string, string>;
  dateFormat: string;
  bankId?: string;
  skipRows?: number; // Number of rows to skip before starting to parse data
  customConfig?: {
    creditColumn?: string; // For banks with separate credit/debit columns
    [key: string]: any; // Allow other custom configurations
  };
}
