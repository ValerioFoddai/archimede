import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  loading?: boolean;
  selectedFile?: File | null;
}

export function FileUpload({ onUpload, loading, selectedFile }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    try {
      setError(null);

      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        setError(error.message);
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        // Validate file type
        if (!fileExtension || !['csv', 'xlsx'].includes(fileExtension)) {
          setError('Please upload a CSV or XLSX file');
          return;
        }

        await onUpload(file);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-accent' : 'border-muted hover:border-primary',
          loading && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : error ? (
            <AlertCircle className="h-8 w-8 text-destructive" />
          ) : selectedFile ? (
            <FileSpreadsheet className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          
          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                Click or drag to replace file
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag and drop your file here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: CSV, XLSX
              </p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}