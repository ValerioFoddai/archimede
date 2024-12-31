import { useState, useCallback, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useTagOperations } from './useTagOperations';
import { Tag, CreateTagInput, UpdateTagInput } from '@/types/tags';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { user } = useAuth();
  const { createTag: createTagOp, updateTag: updateTagOp, deleteTag: deleteTagOp, isUndoing } = useTagOperations();

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
    if (!user) return null;
    const newTag = await createTagOp(input, user.id);
    if (newTag) {
      setTags(prev => [newTag, ...prev]);
    }
    return newTag;
  };

  const updateTag = async (input: UpdateTagInput) => {
    const updatedTag = await updateTagOp(input);
    if (updatedTag) {
      setTags(prev => prev.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
    }
    return updatedTag;
  };

  const deleteTag = async (id: string) => {
    const tagToDelete = tags.find(tag => tag.id === id);
    if (!tagToDelete) return false;
    
    const success = await deleteTagOp(tagToDelete);
    if (success) {
      setTags(prev => prev.filter(tag => tag.id !== id));
    }
    return success;
  };

  useEffect(() => {
    if (!isUndoing) {
      fetchTags();
    }
  }, [fetchTags, isUndoing]);

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