import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { Columns } from "lucide-react";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import type { ColumnVisibility } from "@/types/transactions";

interface ColumnsVisibilityProps {
  value: ColumnVisibility;
  onChange: (visibility: ColumnVisibility) => void;
}

export function ColumnsVisibility({ value, onChange }: ColumnsVisibilityProps) {
  const columns = [
    { key: "bank" as const, label: "Bank" },
    { key: "category" as const, label: "Category" },
    { key: "tags" as const, label: "Tags" },
    { key: "notes" as const, label: "Notes" },
  ];

  const visibleCount = Object.values(value).filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            visibleCount === 0 && "text-muted-foreground"
          )}
        >
          <Columns className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="grid gap-4">
          <div className="grid gap-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${column.key}`}
                  checked={value[column.key]}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...value,
                      [column.key]: checked as boolean,
                    });
                  }}
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

          {/* Show/Hide All */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onChange({
                  bank: true,
                  category: true,
                  tags: true,
                  notes: true,
                })
              }
            >
              Show All
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onChange({
                  bank: false,
                  category: false,
                  tags: false,
                  notes: false,
                })
              }
            >
              Hide All
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
