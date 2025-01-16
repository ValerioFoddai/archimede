import { Plus, Upload, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColumnsVisibility } from "./columns-visibility";
import { TimeFilter } from "./time-filter";
import type { TimeRange, ColumnVisibility } from "@/types/transactions";

interface TransactionHeaderProps {
  onAddTransaction: () => void;
  onApplyRules: () => void;
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function TransactionHeader({ 
  onAddTransaction,
  onApplyRules,
  columnVisibility,
  onColumnVisibilityChange,
  timeRange,
  onTimeRangeChange,
}: TransactionHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage your transactions
        </p>
      </div>
      <div className="flex items-center gap-2">
        <TimeFilter value={timeRange} onChange={onTimeRangeChange} />
        <ColumnsVisibility value={columnVisibility} onChange={onColumnVisibilityChange} />
        <Button variant="outline" size="icon" onClick={onApplyRules}>
          <Bot className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onAddTransaction}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button asChild>
          <Link to="/transactions/import">
            <Upload className="mr-2 h-4 w-4" />
            Import Transactions
          </Link>
        </Button>
      </div>
    </div>
  );
}
