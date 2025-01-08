import { ImportMapping } from '../../types/import';
import { supabase } from '../supabase';

export async function saveMappingConfig(
  userId: string,
  name: string,
  dateFormat: string,
  columnMappings: Record<string, string>
): Promise<ImportMapping> {
  const { data, error } = await supabase
    .from('import_mappings')
    .insert({
      user_id: userId,
      name,
      date_format: dateFormat,
      column_mappings: columnMappings,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    dateFormat: data.date_format,
    columnMappings: data.column_mappings,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function loadMappingConfigs(userId: string): Promise<ImportMapping[]> {
  const { data, error } = await supabase
    .from('import_mappings')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;

  return data.map(mapping => ({
    id: mapping.id,
    name: mapping.name,
    dateFormat: mapping.date_format,
    columnMappings: mapping.column_mappings,
    createdAt: mapping.created_at,
    updatedAt: mapping.updated_at,
  }));
}

export async function deleteMappingConfig(userId: string, mappingId: string): Promise<void> {
  const { error } = await supabase
    .from('import_mappings')
    .delete()
    .eq('user_id', userId)
    .eq('id', mappingId);

  if (error) throw error;
}

export async function updateMappingConfig(
  userId: string,
  mappingId: string,
  updates: Partial<Pick<ImportMapping, 'name' | 'dateFormat' | 'columnMappings'>>
): Promise<ImportMapping> {
  const { data, error } = await supabase
    .from('import_mappings')
    .update({
      name: updates.name,
      date_format: updates.dateFormat,
      column_mappings: updates.columnMappings,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('id', mappingId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    dateFormat: data.date_format,
    columnMappings: data.column_mappings,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
