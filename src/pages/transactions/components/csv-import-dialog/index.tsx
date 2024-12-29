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
import { useBankTemplates } from '../../../../hooks/useBankTemplates';
import { BankSelector } from './bank-selector';
import { ColumnMapper } from './column-mapper';
import { BankTemplateWithMappings } from '../../../../types/bank-templates';

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ImportStep = 'select-bank' | 'map-columns' | 'confirm';

export function CSVImportDialog({ open, onOpenChange }: CSVImportDialogProps) {
  const [step, setStep] = useState<ImportStep>('select-bank');
  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BankTemplateWithMappings | null>(null);
  const [uploading, setUploading] = useState(false);
  const { templates, loading: templatesLoading, processCSV } = useBankTemplates();
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

  const handleTemplateSelect = (template: BankTemplateWithMappings) => {
    setSelectedTemplate(template);
    setStep('map-columns');
  };

  const handleUpload = async () => {
    if (!file || !selectedTemplate) return;

    try {
      setUploading(true);
      await processCSV(file, selectedTemplate.id);
      onOpenChange(false);
      // Reset state
      setFile(null);
      setSelectedTemplate(null);
      setStep('select-bank');
    } catch (error) {
      // Error handling is done in processCSV
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    if (step === 'map-columns') {
      setStep('select-bank');
      setSelectedTemplate(null);
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
                templates={templates}
                loading={templatesLoading}
                onSelect={handleTemplateSelect}
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

          {step === 'map-columns' && file && selectedTemplate && (
            <ColumnMapper
              file={file}
              template={selectedTemplate}
              onConfirm={() => setStep('confirm')}
            />
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Import Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Bank: {selectedTemplate?.name}
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
              <Button onClick={handleUpload} disabled={!file || !selectedTemplate || uploading}>
                {uploading ? 'Importing...' : 'Import'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
