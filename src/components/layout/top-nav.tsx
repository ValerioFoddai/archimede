import { Bell, ChevronDown, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu"
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../lib/auth';

export function TopNav() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isPathActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="text-xl font-bold">
            Archimede
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
                    isPathActive('/dashboard')
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link to="/dashboard">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
                    isPathActive('/transactions')
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link to="/transactions">Transactions</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
                    isPathActive('/analytics')
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link to="/analytics">Analytics</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
                    isPathActive('/settings')
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link to="/settings">Settings</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.email || ''}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="hidden md:inline-block">
                  {user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}