import { useState, useCallback, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/useToast';
import { Tag, CreateTagInput, UpdateTagInput } from '@/types/tags';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTags = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error('Error fetching tags:', pgError);
      setError(pgError);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
        .from('user_tags')
        .insert([{ ...input, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
      return data;
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error('Error creating tag:', pgError);
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
        .from('user_tags')
        .update({ name: input.name, description: input.description })
        .eq('id', input.id)
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
      console.error('Error updating tag:', pgError);
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
        .from('user_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== id));
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      return true;
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error('Error deleting tag:', pgError);
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
    error,
    createTag,
    updateTag,
    deleteTag,
    refresh: fetchTags,
  };
}