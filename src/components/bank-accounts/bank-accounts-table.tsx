import { UserBankAccount } from "@/hooks/useUserBankAccounts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BankAccountsTableProps {
  accounts: UserBankAccount[];
}

export function BankAccountsTable({ accounts }: BankAccountsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.account_name}</TableCell>
              <TableCell>{account.bank.name}</TableCell>
              <TableCell>€{account.balance.toFixed(2)}</TableCell>
              <TableCell>{account.description || '-'}</TableCell>
            </TableRow>
          ))}
          {accounts.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No bank accounts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
