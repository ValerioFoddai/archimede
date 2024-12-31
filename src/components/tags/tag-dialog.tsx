import { useState } from "react";
import { Tag } from "@/types/tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTags } from "@/hooks/useTags";
import { useToast } from "@/hooks/useToast";

interface TagDialogProps {
  tag?: Tag;
  onClose: () => void;
}

export function TagDialog({ tag, onClose }: TagDialogProps) {
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