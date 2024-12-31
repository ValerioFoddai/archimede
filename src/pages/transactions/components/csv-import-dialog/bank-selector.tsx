import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

interface BankTemplate {
  id: string;
  name: string;
}

interface BankSelectorProps {
  templates: BankTemplate[];
  loading: boolean;
  onSelect: (template: BankTemplate) => void;
}

export function BankSelector({ templates, loading, onSelect }: BankSelectorProps) {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading banks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Select Bank</label>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground text-center">
            No banks available.
          </p>
        </div>
      ) : (
        <Select onValueChange={(value) => {
          const template = templates.find(t => t.id === value);
          if (template) onSelect(template);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a bank" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
