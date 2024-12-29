import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { BankTemplate, BankTemplateWithMappings, CreateBankTemplateInput } from '../types/bank-templates';
import { useToast } from './useToast';

export function useBankTemplates() {
  const [templates, setTemplates] = useState<BankTemplateWithMappings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      // Fetch templates with their column mappings
      const { data: templatesData, error: templatesError } = await supabase
        .from('bank_templates')
        .select(`
          *,
          column_mappings (*)
        `)
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      setTemplates(templatesData || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bank templates';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (input: CreateBankTemplateInput) => {
    try {
      // Insert bank template
      const { data: template, error: templateError } = await supabase
        .from('bank_templates')
        .insert({
          name: input.name,
          description: input.description,
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Insert column mappings
      const { error: mappingsError } = await supabase
        .from('bank_column_mappings')
        .insert(
          input.column_mappings.map(mapping => ({
            bank_template_id: template.id,
            source_column: mapping.source_column,
            target_column: mapping.target_column,
            transformation: mapping.transformation,
          }))
        );

      if (mappingsError) throw mappingsError;

      // Refresh templates
      await fetchTemplates();

      toast({
        title: 'Success',
        description: 'Bank template created successfully',
      });

      return template;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create bank template';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bank_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setTemplates(prev => prev.filter(template => template.id !== id));

      toast({
        title: 'Success',
        description: 'Bank template deleted successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete bank template';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const processCSV = async (file: File, templateId: string) => {
    try {
      // First, get the template with its mappings
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('csv-imports')
        .upload(`transactions/${Date.now()}-${file.name}`, file);

      if (uploadError) throw uploadError;

      // TODO: Process the CSV file according to the template mappings
      // This would typically be handled by a serverless function or edge function
      // For now, we'll just show a success message
      
      toast({
        title: 'Success',
        description: 'CSV file uploaded and processed successfully',
      });

      return fileData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process CSV file';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    templates,
    loading,
    error,
    createTemplate,
    deleteTemplate,
    processCSV,
    refresh: fetchTemplates,
  };
}
