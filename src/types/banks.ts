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
}
