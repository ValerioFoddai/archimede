import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTags } from '@/hooks/useTags';
import type { TransactionFormData } from '@/types/transactions';

interface TagSelectProps {
  control: Control<TransactionFormData>;
}

export function TagSelect({ control }: TagSelectProps) {
  const { tags } = useTags();

  return (
    <FormField
      control={control}
      name="tagIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value?.length && "text-muted-foreground"
                  )}
                >
                  {field.value && field.value.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {field.value.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="mr-1"
                          >
                            {tag.name}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    "Select tags"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {tags.map((tag) => {
                    const isSelected = field.value?.includes(tag.id);
                    return (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => {
                          const newValue = isSelected
                            ? (field.value || []).filter((id) => id !== tag.id)
                            : [...(field.value || []), tag.id];
                          field.onChange(newValue);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
