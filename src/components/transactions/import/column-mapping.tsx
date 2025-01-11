import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ColumnMappingProps {
  headers: string[];
  columnMappings: Record<string, string>;
  onMappingChange: (field: string, value: string) => void;
}

const REQUIRED_FIELDS = [
  { key: 'date', label: 'Date' },
  { key: 'merchant', label: 'Merchant/Description' },
  { key: 'amount', label: 'Amount' },
];

const OPTIONAL_FIELDS = [
  { key: 'notes', label: 'Notes' },
];

export function ColumnMapping({ headers, columnMappings, onMappingChange }: ColumnMappingProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {REQUIRED_FIELDS.map(field => (
          <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
            <label className="text-sm font-medium">
              {field.label}
              <span className="text-destructive ml-1">*</span>
            </label>
            <Select
              value={columnMappings[field.key] || ''}
              onValueChange={(value) => onMappingChange(field.key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label} column`} />
              </SelectTrigger>
              <SelectContent>
                {headers.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {OPTIONAL_FIELDS.map(field => (
          <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
            <label className="text-sm font-medium">
              {field.label}
            </label>
            <Select
              value={columnMappings[field.key] || ''}
              onValueChange={(value) => onMappingChange(field.key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label} column (optional)`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {headers.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
