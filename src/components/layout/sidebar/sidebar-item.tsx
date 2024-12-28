import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar-context';
import { Tooltip } from '@/components/ui/tooltip';

interface SidebarItemProps {
  icon: LucideIcon;
  name: string;
  href: string;
}

export function SidebarItem({ icon: Icon, name, href }: SidebarItemProps) {
  const { isExpanded } = useSidebar();

  const link = (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
          isExpanded ? 'justify-start' : 'justify-center',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent'
        )
      }
    >
      <Icon className={cn('h-5 w-5', isExpanded && 'mr-3')} />
      {isExpanded && <span>{name}</span>}
    </NavLink>
  );

  if (!isExpanded) {
    return (
      <Tooltip content={name} side="right">
        {link}
      </Tooltip>
    );
  }

  return link;
}