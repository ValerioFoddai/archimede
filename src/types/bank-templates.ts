export interface BankTemplate {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface BankColumnMapping {
  id: string;
  bank_template_id: string;
  source_column: string;
  target_column: 'date' | 'description' | 'amount' | 'notes';
  transformation: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankTemplateWithMappings extends BankTemplate {
  column_mappings: BankColumnMapping[];
}

export interface CreateBankTemplateInput {
  name: string;
  description?: string;
  column_mappings: Array<{
    source_column: string;
    target_column: 'date' | 'description' | 'amount' | 'notes';
    transformation?: string;
  }>;
}
