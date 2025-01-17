import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ColumnVisibility } from '@/types/transactions';

// Cache for column preferences
let preferencesCache: { [userId: string]: ColumnVisibility } = {};

export function useColumnPreferences() {
  const defaultVisibility: ColumnVisibility = {
    bank: true,
    category: true,
    tags: true,
    notes: true,
  };

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultVisibility);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize preferences for the current user and cache them
  const initializePreferences = async (userId: string): Promise<ColumnVisibility> => {
    try {
      const defaultColumns = [
        { user_id: userId, column_name: 'Bank', is_visible: true },
        { user_id: userId, column_name: 'Category', is_visible: true },
        { user_id: userId, column_name: 'Tags', is_visible: true },
        { user_id: userId, column_name: 'Notes', is_visible: true },
      ];

      const { error } = await supabase
        .from('columns_transactions')
        .upsert(defaultColumns, {
          onConflict: 'user_id,column_name',
        });

      if (error) {
        console.error('Error initializing preferences:', error);
        return defaultVisibility;
      }

      // Return default visibility after initialization
      return defaultVisibility;
    } catch (error) {
      console.error('Error in initializePreferences:', error);
      return defaultVisibility;
    }
  };

  // Load preferences from cache or fetch from database
  const loadPreferences = async (userId: string): Promise<ColumnVisibility> => {
    try {
      // Check cache first
      if (preferencesCache[userId]) {
        return preferencesCache[userId];
      }

      const { data: preferences, error } = await supabase
        .from('columns_transactions')
        .select('column_name, is_visible')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching preferences:', error);
        return defaultVisibility;
      }

      if (!preferences || preferences.length === 0) {
        const initialVisibility = await initializePreferences(userId);
        preferencesCache[userId] = initialVisibility;
        return initialVisibility;
      }

      // Create visibility map from preferences
      const visibilityMap = preferences.reduce<ColumnVisibility>(
        (acc, { column_name, is_visible }) => {
          const key = column_name.toLowerCase() as keyof ColumnVisibility;
          acc[key] = is_visible;
          return acc;
        },
        { ...defaultVisibility }
      );

      // Cache the result
      preferencesCache[userId] = visibilityMap;
      return visibilityMap;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return defaultVisibility;
    }
  };

  // Fetch preferences on mount
  useEffect(() => {
    async function fetchPreferences() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const visibility = await loadPreferences(user.id);
        setColumnVisibility(visibility);
      } catch (error) {
        console.error('Error in fetchPreferences:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreferences();
  }, []);

  // Update preferences in the database and cache
  const updatePreferences = async (newVisibility: ColumnVisibility): Promise<boolean> => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        return false;
      }

      // Prepare the updates with user_id
      const updates = Object.entries(newVisibility).map(([key, value]) => ({
        user_id: user.id,
        column_name: key.charAt(0).toUpperCase() + key.slice(1),
        is_visible: value,
      }));

      // Update all preferences in a single transaction
      const { error } = await supabase
        .from('columns_transactions')
        .upsert(updates, {
          onConflict: 'user_id,column_name',
        });

      if (error) {
        console.error('Error updating preferences:', error);
        return false;
      }

      // Update cache and state
      preferencesCache[user.id] = newVisibility;
      setColumnVisibility(newVisibility);
      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Force refresh preferences
  const refreshPreferences = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Clear cache for this user
      delete preferencesCache[user.id];
      
      // Re-fetch preferences
      const visibility = await loadPreferences(user.id);
      setColumnVisibility(visibility);
    } catch (error) {
      console.error('Error refreshing preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    columnVisibility,
    updatePreferences,
    refreshPreferences,
    isLoading,
  };
}
