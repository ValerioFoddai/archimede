import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { useToast } from '../../../../hooks/useToast';
import { BankSelector } from './bank-selector';
import { ColumnMapper } from './column-mapper';

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Bank {
  id: string;
  name: string;
}

interface ColumnMapping {
  source_column: string;
  target_column: string;
}

type ImportStep = 'select-bank' | 'map-columns' | 'confirm';

// Default banks since we no longer use templates
const defaultBanks: Bank[] = [
  { id: 'chase', name: 'Chase' },
  { id: 'bofa', name: 'Bank of America' },
  { id: 'wells', name: 'Wells Fargo' }
];

// Default column mappings for each bank
const defaultMappings: Record<string, ColumnMapping[]> = {
  chase: [
    { source_column: 'Transaction Date', target_column: 'date' },
    { source_column: 'Description', target_column: 'description' },
    { source_column: 'Amount', target_column: 'amount' }
  ],
  bofa: [
    { source_column: 'Date', target_column: 'date' },
    { source_column: 'Payee', target_column: 'description' },
    { source_column: 'Amount', target_column: 'amount' }
  ],
  wells: [
    { source_column: 'Date', target_column: 'date' },
    { source_column: 'Description', target_column: 'description' },
    { source_column: 'Amount', target_column: 'amount' }
  ]
};

export function CSVImportDialog({ open, onOpenChange }: CSVImportDialogProps) {
  const [step, setStep] = useState<ImportStep>('select-bank');
  const [file, setFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setStep('map-columns');
  };

  const handleUpload = async () => {
    if (!file || !selectedBank) return;

    try {
      setUploading(true);
      // Here you would implement your CSV processing logic
      // For now, just show a success message
      toast({
        title: 'Success',
        description: 'CSV file imported successfully',
      });
      onOpenChange(false);
      // Reset state
      setFile(null);
      setSelectedBank(null);
      setStep('select-bank');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import CSV file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    if (step === 'map-columns') {
      setStep('select-bank');
      setSelectedBank(null);
    } else if (step === 'confirm') {
      setStep('map-columns');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            {step === 'select-bank'
              ? 'Select your bank and upload a CSV file.'
              : step === 'map-columns'
              ? 'Review and confirm column mappings.'
              : 'Confirm import details.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'select-bank' && (
            <div className="space-y-4">
              <BankSelector
                templates={defaultBanks}
                loading={false}
                onSelect={handleBankSelect}
              />
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          )}

          {step === 'map-columns' && file && selectedBank && (
            <ColumnMapper
              file={file}
              mappings={defaultMappings[selectedBank.id]}
              onConfirm={() => setStep('confirm')}
            />
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Import Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Bank: {selectedBank?.name}
                  <br />
                  File: {file?.name}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {step !== 'select-bank' && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {step === 'confirm' && (
              <Button onClick={handleUpload} disabled={!file || !selectedBank || uploading}>
                {uploading ? 'Importing...' : 'Import'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
