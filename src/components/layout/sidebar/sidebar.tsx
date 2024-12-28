import { Home, Settings, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from './sidebar-context';
import { SidebarItem } from './sidebar-item';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div
      className={cn(
        'flex flex-col border-r h-full bg-background transition-all duration-300',
        isExpanded ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex items-center justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <ChevronLeft className={cn(
            'h-4 w-4 transition-transform',
            !isExpanded && 'rotate-180'
          )} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => (
          <SidebarItem
            key={item.name}
            name={item.name}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </nav>
    </div>
  );
}