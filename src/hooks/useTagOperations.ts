import { useState } from 'react';
import { useToast } from './useToast';
import { tagHistory } from '@/lib/tag-history';
import { supabase } from '@/lib/supabase';
import { Tag, CreateTagInput, UpdateTagInput } from '@/types/tags';
import { toastMessages } from '@/lib/toast-messages';

export function useTagOperations() {
  const [isUndoing, setIsUndoing] = useState(false);
  const { toast } = useToast();

  const handleError = (error: Error, operation: string) => {
    toast(toastMessages.error(operation, error.message));
  };

  const createTag = async (input: CreateTagInput, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_tags')
        .insert([{ ...input, user_id: userId }])
        .select()
        .single();

      if (error) throw error;

      tagHistory.addOperation('create', data);
      
      toast({
        ...toastMessages.create(data.name),
        action: {
          label: "Undo",
          onClick: async () => {
            setIsUndoing(true);
            try {
              await supabase.from('user_tags').delete().eq('id', data.id);
              toast(toastMessages.undo.create);
            } catch (error) {
              handleError(error as Error, 'undo creation');
            } finally {
              setIsUndoing(false);
            }
          },
        },
      });

      return data;
    } catch (error) {
      handleError(error as Error, 'create tag');
      return null;
    }
  };

  const updateTag = async (input: UpdateTagInput) => {
    try {
      const previousTag = (await supabase
        .from('user_tags')
        .select()
        .eq('id', input.id)
        .single()).data;

      const { data, error } = await supabase
        .from('user_tags')
        .update({ name: input.name, description: input.description })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw error;

      tagHistory.addOperation('update', data, previousTag);
      
      toast({
        ...toastMessages.update(previousTag.name, data.name),
        action: {
          label: "Undo",
          onClick: async () => {
            setIsUndoing(true);
            try {
              await supabase
                .from('user_tags')
                .update({ name: previousTag.name, description: previousTag.description })
                .eq('id', input.id);
              toast(toastMessages.undo.update);
            } catch (error) {
              handleError(error as Error, 'undo update');
            } finally {
              setIsUndoing(false);
            }
          },
        },
      });

      return data;
    } catch (error) {
      handleError(error as Error, 'update tag');
      return null;
    }
  };

  const deleteTag = async (tag: Tag) => {
    try {
      const { error } = await supabase
        .from('user_tags')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;

      tagHistory.addOperation('delete', tag);
      
      toast({
        ...toastMessages.delete(tag.name),
        action: {
          label: "Undo",
          onClick: async () => {
            setIsUndoing(true);
            try {
              const { name, description, user_id } = tag;
              await supabase
                .from('user_tags')
                .insert([{ id: tag.id, name, description, user_id }]);
              toast(toastMessages.undo.delete);
            } catch (error) {
              handleError(error as Error, 'undo deletion');
            } finally {
              setIsUndoing(false);
            }
          },
        },
      });

      return true;
    } catch (error) {
      handleError(error as Error, 'delete tag');
      return false;
    }
  };

  return {
    createTag,
    updateTag,
    deleteTag,
    isUndoing,
  };
}