import { BankTemplateWithMappings } from '../../../../types/bank-templates';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BankSelectorProps {
  templates: BankTemplateWithMappings[];
  loading: boolean;
  onSelect: (template: BankTemplateWithMappings) => void;
}

export function BankSelector({ templates, loading, onSelect }: BankSelectorProps) {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading banks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Select Bank</label>
        <Button variant="outline" size="sm" asChild>
          <Link to="/settings/bank-templates">
            <Plus className="mr-2 h-4 w-4" />
            Add Bank Template
          </Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground text-center">
            No bank templates found. Create one to get started.
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
