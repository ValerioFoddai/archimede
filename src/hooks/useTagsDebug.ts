import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { checkSupabaseConnection } from '@/lib/supabase-debug';

export function useTagsDebug(tags: any[], loading: boolean, error: any) {
  const { user } = useAuth();

  useEffect(() => {
    async function performChecks() {
      console.group('Tags Data Loading Diagnostics');
      
      // 1. Check Authentication
      console.info('1. Authentication Check:');
      console.info(`User authenticated: ${!!user}`);
      if (user) {
        console.info(`User ID: ${user.id}`);
      }

      // 2. Check Database Connection
      console.info('\n2. Database Connection Check:');
      await checkSupabaseConnection();

      // 3. Check Data Loading State
      console.info('\n3. Data Loading State:');
      console.info(`Loading: ${loading}`);
      console.info(`Data count: ${tags.length}`);

      // 4. Check for Errors
      console.info('\n4. Error State:');
      if (error) {
        console.error('Error detected:', error);
      } else {
        console.info('No errors detected');
      }

      // 5. Data Structure Validation
      console.info('\n5. Data Structure Check:');
      if (tags.length > 0) {
        const sampleTag = tags[0];
        console.info('Sample tag structure:', {
          hasId: 'id' in sampleTag,
          hasName: 'name' in sampleTag,
          hasDescription: 'description' in sampleTag,
          hasUserId: 'user_id' in sampleTag,
          hasCreatedAt: 'created_at' in sampleTag,
        });
      } else {
        console.info('No tags available to check structure');
      }

      console.groupEnd();
    }

    performChecks();
  }, [user, tags, loading, error]);
}