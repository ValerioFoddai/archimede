export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: number;
  notes?: string;
  created_at: string;
  user_id: string;
}