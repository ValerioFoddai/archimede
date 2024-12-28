import { TopNav } from './top-nav';
import { Sidebar } from './sidebar/sidebar';
import { SidebarProvider } from './sidebar/sidebar-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex h-[calc(100vh-4rem)]">
        <SidebarProvider>
          <Sidebar />
        </SidebarProvider>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}