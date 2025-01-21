import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";

export function AssetsSidebar() {
  const location = useLocation();

  return (
    <nav className="grid items-start gap-2">
      <Link
        to="/assets/accounts"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          location.pathname === "/assets/accounts"
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline",
          "justify-start"
        )}
      >
        Accounts
      </Link>
      <Link
        to="/assets/test"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          location.pathname === "/assets/test"
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline",
          "justify-start"
        )}
      >
        Test
      </Link>
    </nav>
  );
}
