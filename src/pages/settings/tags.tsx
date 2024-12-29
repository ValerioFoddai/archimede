import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tag } from "../../types/tags";
import { useTags } from "../../hooks/useTags";
import { useToast } from "../../hooks/useToast";

function TagDialog({
  tag,
  onClose,
}: {
  tag?: Tag;
  onClose: () => void;
}) {
  const { createTag, updateTag } = useTags();
  const [name, setName] = useState(tag?.name ?? "");
  const [description, setDescription] = useState(tag?.description ?? "");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const input = { name, description };
      const result = tag
        ? await updateTag({ ...input, id: tag.id })
        : await createTag(input);

      if (result) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting tag:', error);
      toast({
        title: "Error",
        description: "Failed to save tag",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{tag ? "Edit Tag" : "Create Tag"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter tag name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter tag description"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{tag ? "Update" : "Create"}</Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default function TagsPage() {
  const { tags, loading, fetchTags, deleteTag } = useTags();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Current user:", user?.id);
    console.log("Current tags:", tags);
    console.log("Loading state:", loading);
    
    if (user) {
      console.log("Fetching tags for user:", user.id);
      fetchTags();
    }
  }, [user?.id, fetchTags]); // Combine both effects into one

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      await deleteTag(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Tag</Button>
          </DialogTrigger>
          <TagDialog
            tag={selectedTag}
            onClose={() => {
              setDialogOpen(false);
              setSelectedTag(undefined);
            }}
          />
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredTags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
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
                      onClick={() => {
                        setSelectedTag(tag);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(tag.id)}
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
  );
}
