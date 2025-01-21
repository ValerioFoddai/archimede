import { useState, useEffect } from "react";
import { useImport } from "@/hooks/useImport";
import { useImportBankAccounts } from "@/hooks/useImportBankAccounts";
import { BankAccountSelection } from "@/components/bank-accounts/bank-account-selection";
import { QuickBankAccountForm } from "@/components/bank-accounts/quick-bank-account-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { TransactionImport, ImportConfig } from "@/types/import";

interface ImportFlowProps {
  config: ImportConfig;
  onComplete: () => void;
  onCancel: () => void;
}

export function ImportFlow({ config, onComplete, onCancel }: ImportFlowProps) {
  const [step, setStep] = useState<"account-selection" | "create-account" | "import">(
    "account-selection"
  );
  const [transactions, setTransactions] = useState<TransactionImport[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const { processFile, importTransactions, loading: importLoading } = useImport();
  const {
    hasExistingAccounts,
    loading: accountsLoading,
    error: accountsError,
    getSelectedBankName,
  } = useImportBankAccounts(config.bankId);

  const bankName = getSelectedBankName();

  // Clear error when changing steps
  useEffect(() => {
    setImportError(null);
  }, [step]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const parsedTransactions = await processFile(file, config);
      
      // Add bank_account_id to transactions if one is selected
      const transactionsWithAccount = parsedTransactions.map(t => ({
        ...t,
        bank_account_id: selectedAccountId?.toString()
      }));
      
      setTransactions(transactionsWithAccount);
      
      // Check for any transactions with error status
      const errorTransactions = transactionsWithAccount.filter((t: TransactionImport) => t.status === 'error');
      if (errorTransactions.length > 0) {
        const errors = errorTransactions.map((t: TransactionImport) => t.errors.join(', ')).join('; ');
        setImportError(`Some transactions have errors: ${errors}`);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setImportError(error instanceof Error ? error.message : "Failed to process file");
      setTransactions([]);
    }
  };

  const handleAccountSelect = (accountId: number | null) => {
    setSelectedAccountId(accountId);
    // Assign the selected account to all transactions
    setTransactions(transactions.map((t: TransactionImport) => ({
      ...t,
      bank_account_id: accountId?.toString()
    })));
    setStep("import");
  };

  const handleAccountCreated = (accountId: number) => {
    handleAccountSelect(accountId);
  };

  const handleImport = async () => {
    try {
      await importTransactions(transactions);
      onComplete();
    } catch (error) {
      console.error("Error importing transactions:", error);
      // Show error in UI
      setImportError(error instanceof Error ? error.message : "Failed to import transactions");
    }
  };

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (accountsError || importError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {accountsError?.message || importError || "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {step === "account-selection" && (
          <div className="space-y-6">
            <BankAccountSelection
              bankId={config.bankId}
              onAccountSelect={handleAccountSelect}
              onCreateNew={() => setStep("create-account")}
            />
          </div>
        )}

        {step === "create-account" && bankName && (
          <QuickBankAccountForm
            bankId={config.bankId!}
            bankName={bankName}
            onAccountCreated={handleAccountCreated}
            onCancel={() => setStep("account-selection")}
          />
        )}

        {step === "import" && (
          <div className="space-y-4">
            {importError && (
              <Alert variant="destructive">
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".csv,.xls,.xlsx"
                className="flex-1"
              />
              <Button
                onClick={handleImport}
                disabled={importLoading || transactions.length === 0}
              >
                {importLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import Transactions"
                )}
              </Button>
            </div>

            {transactions.length > 0 && (
              <Alert>
                <AlertDescription>
                  {transactions.length} transactions ready to import
                  {selectedAccountId && " with selected bank account"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step !== "import" && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel Import
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
