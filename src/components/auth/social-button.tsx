import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function SocialButton({ icon, children, className, ...props }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("w-full flex items-center justify-center gap-2", className)}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
}