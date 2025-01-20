import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import { Check, ChevronDown, Calendar } from "lucide-react";
import { cn } from "../../../lib/utils";
import { format, isValid } from "date-fns";
import { Calendar as CalendarComponent } from "../../../components/ui/calendar";
import type { TimeRange } from '../../../types/transactions';

interface TimeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

type Range = {
  value: TimeRange;
  label: string;
  isCustom?: boolean;
};

function generateTimeRanges() {
  const ranges: Range[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Add custom date range option at the top
  ranges.push({
    value: `custom-${format(now, 'yyyy-MM-dd')}-${format(now, 'yyyy-MM-dd')}`,
    label: 'Custom Date Range',
    isCustom: true
  });

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
      value: `month-${year}-${String(month + 1).padStart(2, '0')}` as TimeRange,
      label: format(date, 'MMMM yyyy')
    });
  }

  return ranges;
}

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  const timeRanges = generateTimeRanges();
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Parse current value if it's a custom range
  const customMatch = value.match(/^custom-(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$/);
  if (customMatch && !startDate && !endDate) {
    const [_, start, end] = customMatch;
    setStartDate(new Date(start));
    setEndDate(new Date(end));
  }

  const selectedRange = timeRanges.find(range => range.value === value) || {
    label: customMatch 
      ? `${format(new Date(customMatch[1]), 'MMM d, yyyy')} - ${format(new Date(customMatch[2]), 'MMM d, yyyy')}`
      : "Select time range"
  };

  const handleRangeSelect = (range: Range) => {
    if (range.isCustom) {
      setIsCustomDateOpen(true);
    } else {
      onChange(range.value);
      setIsCustomDateOpen(false);
    }
  };

  const handleCustomDateSelect = () => {
    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
      if (startDate > endDate) {
        // Swap dates if start is after end
        const temp = startDate;
        setStartDate(endDate);
        setEndDate(temp);
      }
      onChange(`custom-${format(startDate, 'yyyy-MM-dd')}-${format(endDate, 'yyyy-MM-dd')}` as TimeRange);
      setIsCustomDateOpen(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[250px] justify-between",
            !selectedRange && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {selectedRange.label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!isCustomDateOpen ? (
          <div className="max-h-[300px] overflow-auto">
            {timeRanges.map((range) => (
              <div
                key={range.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === range.value && "bg-accent"
                )}
                onClick={() => handleRangeSelect(range)}
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
        ) : (
          <div className="p-3 space-y-3">
            <div className="space-y-1.5">
              <div className="font-medium text-sm">Select Date Range</div>
              <CalendarComponent
                mode="range"
                selected={{
                  from: startDate,
                  to: endDate
                }}
                onSelect={(range) => {
                  if (range?.from) setStartDate(range.from);
                  if (range?.to) setEndDate(range.to);
                }}
                initialFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomDateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCustomDateSelect}
                disabled={!startDate || !endDate}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
