import { Plus, Upload, Bot } from "lucide-react";
import { BankFilter } from "./bank-filter";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColumnsVisibility } from "./columns-visibility";
import { TimeFilter } from "./time-filter";
import type { TimeRange } from "@/types/transactions";

interface TransactionHeaderProps {
  onAddTransaction: () => void;
  onApplyRules: () => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  bankId?: string;
  onBankChange: (bankId: string | undefined) => void;
  activeBankIds: string[];
  onRefresh: () => void;
}

export function TransactionHeader({ 
  onAddTransaction,
  onApplyRules,
  timeRange,
  onTimeRangeChange,
  bankId,
  onBankChange,
  activeBankIds,
  onRefresh,
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
        <BankFilter 
          value={bankId} 
          onChange={onBankChange}
          activeBankIds={activeBankIds}
        />
        <ColumnsVisibility onRefresh={onRefresh} />
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
