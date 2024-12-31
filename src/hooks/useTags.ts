import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/useToast";
import { Tag, CreateTagInput, UpdateTagInput } from "@/types/tags";
import { PostgrestError } from "@supabase/supabase-js";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTags = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error("Error fetching tags:", {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      });
      toast({
        title: "Error",
        description: `Failed to fetch tags: ${pgError.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createTag = async (input: CreateTagInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create tags",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert([{ ...input, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
      return data;
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error("Error creating tag:", {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      });
      toast({
        title: "Error",
        description: `Failed to create tag: ${pgError.message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTag = async (input: UpdateTagInput) => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .update({ name: input.name, description: input.description })
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw error;

      setTags(prev => prev.map(tag => tag.id === input.id ? data : tag));
      toast({
        title: "Success",
        description: "Tag updated successfully",
      });
      return data;
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error("Error updating tag:", {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      });
      toast({
        title: "Error",
        description: `Failed to update tag: ${pgError.message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== id));
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      return true;
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error("Error deleting tag:", {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      });
      toast({
        title: "Error",
        description: `Failed to delete tag: ${pgError.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    refresh: fetchTags,
  };
}
