import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tag, TagFormData } from '@/types/tags';

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

interface TagFormProps {
  tag?: Tag;
  onSubmit: (data: TagFormData) => Promise<void>;
  onCancel: () => void;
}

export function TagForm({ tag, onSubmit, onCancel }: TagFormProps) {
  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || '',
      description: tag?.description || '',
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {tag ? 'Edit Tag' : 'Create New Tag'}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tag name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tag description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {tag ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}