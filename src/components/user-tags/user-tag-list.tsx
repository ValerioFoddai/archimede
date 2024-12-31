import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { UserTag } from "../../types/user-tags";

interface UserTagListProps {
  tags: UserTag[];
  loading: boolean;
  onEdit: (tag: UserTag) => void;
  onDelete: (tag: UserTag) => void;
}

export function UserTagList({ tags, loading, onEdit, onDelete }: UserTagListProps) {
  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">Loading...</div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No tags found. Create one to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
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
        ))}
      </TableBody>
    </Table>
  );
}
