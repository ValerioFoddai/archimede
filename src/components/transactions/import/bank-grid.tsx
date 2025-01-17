import { Bank } from '@/components/ui/bank';
import { Skeleton } from '@/components/ui/skeleton';
import type { Bank as BankType } from '@/types/banks';

interface BankGridProps {
  banks: BankType[];
  loading: boolean;
  selectedBankId: string | null;
  onSelect: (bankId: string) => void;
}

export function BankGrid({ banks, loading, selectedBankId, onSelect }: BankGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (banks.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No banks available
      </div>
    );
  }

  // Sort banks alphabetically but keep Custom CSV Import at the end
  const sortedBanks = [...banks].sort((a, b) => {
    if (a.id === 'custom-csv') return 1;
    if (b.id === 'custom-csv') return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {sortedBanks.map((bank) => (
        <Bank
          key={bank.id}
          bank={bank}
          selected={bank.id === selectedBankId}
          onClick={() => onSelect(bank.id)}
        />
      ))}
    </div>
  );
}
