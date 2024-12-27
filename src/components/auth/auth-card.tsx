import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={cn("sm:mx-auto sm:w-full sm:max-w-md", className)}>
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Archimede
        </h1>
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}