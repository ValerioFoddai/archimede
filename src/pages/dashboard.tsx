import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export function DashboardPage() {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    async function getUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }
    }
    getUserProfile();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          Welcome{userName ? `, ${userName}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground">
          This is your dashboard. Start building something amazing!
        </p>
      </div>
    </DashboardLayout>
  );
}