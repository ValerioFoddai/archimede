import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import { CreateTagInput, Tag, UpdateTagInput } from "../types/tags";
import { useToast } from "./useToast";
import { useAuth } from "../lib/auth";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTags = useCallback(async () => {
    if (!user) {
      console.log("No user found");
      toast({
        title: "Error",
        description: "You must be logged in to view tags",
        variant: "destructive",
      });
      setTags([]);
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching tags for user:", user.id);
      setLoading(true);
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Fetched tags:", data);
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive",
      });
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  const createTag = useCallback(
    async (input: CreateTagInput) => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create tags",
          variant: "destructive",
        });
        return null;
      }

      try {
        setLoading(true);
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
        console.error('Error creating tag:', error);
        toast({
          title: "Error",
          description: "Failed to create tag",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast, user]
  );

  const updateTag = useCallback(
    async (input: UpdateTagInput) => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update tags",
          variant: "destructive",
        });
        return null;
      }

      try {
        setLoading(true);
        const { id, ...rest } = input;
        const { data, error } = await supabase
          .from("tags")
          .update(rest)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        setTags(prev => prev.map(tag => tag.id === id ? data : tag));
        toast({
          title: "Success",
          description: "Tag updated successfully",
        });
        return data;
      } catch (error) {
        console.error('Error updating tag:', error);
        toast({
          title: "Error",
          description: "Failed to update tag",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast, user]
  );

  const deleteTag = useCallback(
    async (id: string) => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete tags",
          variant: "destructive",
        });
        return false;
      }

      try {
        setLoading(true);
        const { error } = await supabase.from("tags").delete().eq("id", id);

        if (error) throw error;

        setTags(prev => prev.filter(tag => tag.id !== id));
        toast({
          title: "Success",
          description: "Tag deleted successfully",
        });
        return true;
      } catch (error) {
        console.error('Error deleting tag:', error);
        toast({
          title: "Error",
          description: "Failed to delete tag",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast, user]
  );

  return {
    tags,
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
  };
}
