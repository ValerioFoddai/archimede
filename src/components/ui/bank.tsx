import { cn } from '@/lib/utils';
import type { Bank as BankType } from '@/types/banks';

interface BankProps {
  bank: BankType;
  selected?: boolean;
  onClick?: () => void;
}

export function Bank({ bank, selected, onClick }: BankProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors',
        'hover:bg-accent hover:border-accent',
        selected ? 'border-primary bg-accent' : 'border-muted',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      )}
      onClick={onClick}
    >
      <div className="text-lg font-semibold">{bank.name}</div>
    </button>
  );
}