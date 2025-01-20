import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronDown, Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import type { TimeRange } from '../../hooks/useTransactions';

interface TimeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

function generateTimeRanges() {
  const ranges = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Add 12 months starting from current month
  for (let i = 0; i < 12; i++) {
    let month = currentMonth - i;
    let year = currentYear;
    
    // Adjust for previous year
    if (month < 0) {
      month += 12;
      year -= 1;
    }

    const date = new Date(year, month);
    ranges.push({
      value: `month-${year}-${String(month + 1).padStart(2, '0')}`,
      label: format(date, 'MMMM yyyy'),
      date: date,
      isRecent: false
    });
  }

  return ranges;
}

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  const timeRanges = generateTimeRanges();
  const selectedRange = timeRanges.find(range => range.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-between",
            !selectedRange && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {selectedRange ? selectedRange.label : "Select time range"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="max-h-[300px] overflow-auto">
          {timeRanges.map((range) => (
            <div
              key={range.value}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                value === range.value && "bg-accent"
              )}
              onClick={() => onChange(range.value)}
            >
              <span className="flex-1">
                {range.label}
              </span>
              {value === range.value && (
                <Check className="h-4 w-4" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
