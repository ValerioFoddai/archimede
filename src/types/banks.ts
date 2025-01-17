export interface Bank {
  id: string;
  name: string;
  created_at: string;
}

export interface BankImportConfig {
  fileTypes: string[];
  requiredColumns: string[];
  columnMappings: {
    [key: string]: string;
  };
  skipRows?: number; // Number of rows to skip before starting to parse data
  dateFormat?: string; // Date format for parsing dates
  validateRow?: (row: Record<string, string>) => boolean; // Custom row validation
  customConfig?: {
    [key: string]: any; // Custom configuration specific to each bank
  };
}
