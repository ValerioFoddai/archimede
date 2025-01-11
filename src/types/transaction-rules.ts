import { Database } from "./supabase";

export type TransactionRule = Database["public"]["Tables"]["user_transactions_rules"]["Row"];
export type InsertTransactionRule = Database["public"]["Tables"]["user_transactions_rules"]["Insert"];
export type UpdateTransactionRule = Database["public"]["Tables"]["user_transactions_rules"]["Update"];

export interface TransactionRuleFormData {
  keywords: string;
  main_category: string;
  sub_category: string;
}
