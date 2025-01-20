import { useEffect, useState } from 'react';
import type { ColumnVisibility } from '@/types/transactions';

const STORAGE_KEY = 'archimede_column_preferences';

export function useColumnPreferences() {
  const defaultVisibility: ColumnVisibility = {
    category: true,
    tags: true,
    notes: true,
  };

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultVisibility);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences from localStorage
  const loadPreferences = (): ColumnVisibility => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultVisibility;

      const parsed = JSON.parse(stored);
      // Validate the stored data has all required keys
      const isValid = Object.keys(defaultVisibility).every(key => 
        typeof parsed[key] === 'boolean'
      );

      return isValid ? parsed : defaultVisibility;
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
      return defaultVisibility;
    }
  };

  // Save preferences to localStorage
  const savePreferences = (preferences: ColumnVisibility): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
      return false;
    }
  };

  // Load preferences on mount
  useEffect(() => {
    setIsLoading(true);
    const visibility = loadPreferences();
    setColumnVisibility(visibility);
    setIsLoading(false);
  }, []);

  // Update preferences
  const updatePreferences = async (newVisibility: ColumnVisibility): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = savePreferences(newVisibility);
      
      if (success) {
        setColumnVisibility(newVisibility);
      }
      
      return success;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Force refresh preferences from localStorage
  const refreshPreferences = async () => {
    try {
      setIsLoading(true);
      const visibility = loadPreferences();
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
