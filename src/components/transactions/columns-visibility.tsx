import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { Columns, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useColumnPreferences } from "@/hooks/useColumnPreferences";
import type { ColumnVisibility } from "@/types/transactions";

const columns = [
  { key: "bank" as const, label: "Bank" },
  { key: "category" as const, label: "Category" },
  { key: "tags" as const, label: "Tags" },
  { key: "notes" as const, label: "Notes" },
];

interface ColumnsVisibilityProps {
  onRefresh: () => void;
}

export function ColumnsVisibility({ onRefresh }: ColumnsVisibilityProps) {
  const { columnVisibility, updatePreferences, refreshPreferences, isLoading } = useColumnPreferences();
  const [tempVisibility, setTempVisibility] = useState<ColumnVisibility>(columnVisibility);
  const [isOpen, setIsOpen] = useState(false);
  
  // Update temp visibility when columnVisibility changes
  useEffect(() => {
    setTempVisibility(columnVisibility);
  }, [columnVisibility]);

  const handleVisibilityChange = (key: keyof ColumnVisibility, checked: boolean) => {
    setTempVisibility((prev: ColumnVisibility) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleApply = async () => {
    const success = await updatePreferences(tempVisibility);
    if (success) {
      // Refresh preferences and table data
      await refreshPreferences();
      onRefresh();
      // Close the popover
      setIsOpen(false);
    } else {
      // On failure, reset temp visibility to current visibility
      setTempVisibility(columnVisibility);
      // Keep the popover open so user can see the reset
    }
  };

  // Reset temp visibility when popover opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempVisibility(columnVisibility);
    }
    setIsOpen(open);
  };
  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            visibleCount === 0 && "text-muted-foreground"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Columns className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="grid gap-4">
          <div className="grid gap-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${column.key}`}
                  checked={tempVisibility[column.key]}
                  disabled={isLoading}
                  onCheckedChange={(checked) => handleVisibilityChange(column.key, checked as boolean)}
                />
                <Label
                  htmlFor={`column-${column.key}`}
                  className="text-sm font-normal"
                >
                  {column.label}
                </Label>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleApply}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Changes'
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
