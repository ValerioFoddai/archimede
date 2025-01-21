import { NavLink } from "react-router-dom";
import { Wallet, TestTube } from "lucide-react";
import { cn } from "../../lib/utils";

const navigation = [
  {
    name: "Bank Accounts",
    href: "/assets/bank-accounts",
    icon: Wallet,
  },
  {
    name: "Test",
    href: "/assets/test",
    icon: TestTube,
  },
];

export function AssetsSidebar() {
  return (
    <div className="w-64 border-r">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
