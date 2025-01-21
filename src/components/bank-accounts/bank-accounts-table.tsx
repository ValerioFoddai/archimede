import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { UserBankAccount } from "@/hooks/useUserBankAccounts";
import { Button } from "@/components/ui/button";
import { EditBankAccountDialog } from "./edit-bank-account-dialog";
import { DeleteBankAccountDialog } from "./delete-bank-account-dialog";
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
  onUpdate: (id: string, data: { account_name: string; balance: number; description?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAccountModified: () => void;
}

export function BankAccountsTable({ 
  accounts,
  onUpdate,
  onDelete,
  onAccountModified,
}: BankAccountsTableProps) {
  const [editAccount, setEditAccount] = useState<UserBankAccount | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<UserBankAccount | null>(null);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.account_name}</TableCell>
              <TableCell>{account.bank.name}</TableCell>
              <TableCell>€{account.balance.toFixed(2)}</TableCell>
              <TableCell>{account.description || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditAccount(account)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteAccount(account)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {accounts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No bank accounts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {editAccount && (
        <EditBankAccountDialog
          account={editAccount}
          open={true}
          onOpenChange={(open) => !open && setEditAccount(null)}
          onUpdate={onUpdate}
          onAccountUpdated={onAccountModified}
        />
      )}
      {deleteAccount && (
        <DeleteBankAccountDialog
          account={deleteAccount}
          open={true}
          onOpenChange={(open) => !open && setDeleteAccount(null)}
          onDelete={onDelete}
          onAccountDeleted={onAccountModified}
        />
      )}
    </>
  );
}
