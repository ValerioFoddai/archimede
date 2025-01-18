import { Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useProductNews } from "@/hooks/useProductNews"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

interface ProductNewsIconProps {
  className?: string
}

export function ProductNewsIcon({ className }: ProductNewsIconProps) {
  const { hasUnread } = useProductNews()

  return (
    <div className={cn("relative inline-block", className)}>
      <TooltipProvider>
        <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/product-news">
              <Megaphone className="h-5 w-5" />
              {hasUnread && (
                <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
              )}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Product Updates{hasUnread ? " (New!)" : ""}</p>
        </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
