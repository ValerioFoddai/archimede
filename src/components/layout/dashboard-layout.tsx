import { TopNav } from './top-nav';
import { Analytics } from '@vercel/analytics/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Analytics />
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <TopNav />
      </div>
      <main className="overflow-y-auto p-6 mt-16">
        {children}
      </main>
    </>
  );
}
