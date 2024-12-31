import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag } from '@/types/tags';

interface TagListProps {
  tags: Tag[];
  loading: boolean;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

export function TagList({ tags, loading, onEdit, onDelete }: TagListProps) {
  const [search, setSearch] = useState('');

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase()) ||
    tag.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No tags found
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(tag)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(tag)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}