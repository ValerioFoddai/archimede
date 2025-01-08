import { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useAuth } from '../../../lib/auth';
import { ImportMapping } from '../../../types/import';
import { deleteMappingConfig, loadMappingConfigs, saveMappingConfig } from '../../../lib/import/mapping-storage';

interface MappingManagerProps {
  columnMappings: Record<string, string>;
  dateFormat: string;
  onLoadMapping: (mapping: ImportMapping) => void;
}

const DATE_FORMATS = [
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
  { value: 'dd-MM-yyyy', label: 'DD-MM-YYYY' },
  { value: 'dd.MM.yyyy', label: 'DD.MM.YYYY' },
  { value: 'yyyy.MM.dd', label: 'YYYY.MM.DD' },
];

export function MappingManager({ columnMappings, dateFormat, onLoadMapping }: MappingManagerProps) {
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [newMappingName, setNewMappingName] = useState('');
  const [selectedDateFormat, setSelectedDateFormat] = useState(dateFormat);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMappingConfigs(user.id)
        .then(setMappings)
        .catch(console.error);
    }
  }, [user]);

  const handleSaveMapping = async () => {
    if (!user || !newMappingName.trim()) return;

    try {
      const newMapping = await saveMappingConfig(
        user.id,
        newMappingName.trim(),
        selectedDateFormat,
        columnMappings
      );
      setMappings(prev => [...prev, newMapping]);
      setSaveDialogOpen(false);
      setNewMappingName('');
    } catch (error) {
      console.error('Failed to save mapping:', error);
    }
  };

  const handleDeleteMapping = async (mappingId: string) => {
    if (!user) return;

    try {
      await deleteMappingConfig(user.id, mappingId);
      setMappings(prev => prev.filter(m => m.id !== mappingId));
    } catch (error) {
      console.error('Failed to delete mapping:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Mappings</h3>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Save Current Mapping</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Mapping Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newMappingName}
                  onChange={e => setNewMappingName(e.target.value)}
                  placeholder="Enter mapping name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Format</label>
                <Select value={selectedDateFormat} onValueChange={setSelectedDateFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveMapping} className="w-full">
                Save Mapping
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {mappings.map(mapping => (
          <div
            key={mapping.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <h4 className="font-medium">{mapping.name}</h4>
              <p className="text-sm text-muted-foreground">
                Date Format: {DATE_FORMATS.find(f => f.value === mapping.dateFormat)?.label}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadMapping(mapping)}
              >
                Load
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteMapping(mapping.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
