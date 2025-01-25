import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronDown, Building2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useBanks } from "@/hooks/useBanks";

interface BankFilterProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function BankFilter({ value, onChange }: BankFilterProps) {
  const { banks, loading } = useBanks();

  // Only show filter if there are 2 or more banks
  if (loading || banks.length < 2) {
    return null;
  }

  const selectedBank = value ? banks.find(bank => bank.id === value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-between",
            !selectedBank && "text-muted-foreground"
          )}
        >
          <Building2 className="mr-2 h-4 w-4" />
          {selectedBank ? selectedBank.name.replace(' Import', '') : 'All Banks'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="max-h-[300px] overflow-auto">
          {/* All Banks option */}
          <div
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
              !value && "bg-accent"
            )}
            onClick={() => onChange(undefined)}
          >
            <span className="flex-1">All Banks</span>
            {!value && <Check className="h-4 w-4" />}
          </div>

          {/* Individual banks */}
          {banks.map((bank) => (
            <div
              key={bank.id}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                value === bank.id && "bg-accent"
              )}
              onClick={() => onChange(bank.id)}
            >
              <span className="flex-1">{bank.name.replace(' Import', '')}</span>
              {value === bank.id && <Check className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
