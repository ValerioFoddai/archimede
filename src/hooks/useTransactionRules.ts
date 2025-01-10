import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { TransactionRule, InsertTransactionRule, UpdateTransactionRule } from "../types/transaction-rules";
import { useToast } from "./useToast";

export function useTransactionRules() {
  const [rules, setRules] = useState<TransactionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_transactions_rules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRule = async (rule: Omit<InsertTransactionRule, "user_id">) => {
    try {
      const { data, error } = await supabase
        .from("user_transactions_rules")
        .insert([{ ...rule, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      setRules((prev) => [data, ...prev]);
      toast({
        title: "Rule created",
        description: "Transaction rule has been created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error creating rule",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRule = async (id: string, updates: UpdateTransactionRule) => {
    try {
      const { data, error } = await supabase
        .from("user_transactions_rules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setRules((prev) => prev.map((rule) => (rule.id === id ? data : rule)));
      toast({
        title: "Rule updated",
        description: "Transaction rule has been updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error updating rule",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_transactions_rules")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setRules((prev) => prev.filter((rule) => rule.id !== id));
      toast({
        title: "Rule deleted",
        description: "Transaction rule has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting rule",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    loading,
    createRule,
    updateRule,
    deleteRule,
    refetch: fetchRules,
  };
}
