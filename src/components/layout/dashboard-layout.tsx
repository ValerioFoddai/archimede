import { TopNav } from './top-nav';
import { Analytics } from '@vercel/analytics/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Analytics />
      <TopNav />
      <main className="overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
