import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { UserTagList } from "../../components/user-tags/user-tag-list";
import { UserTagDialog } from "../../components/user-tags/user-tag-dialog";
import { useUserTags } from "../../hooks/useUserTags";
import type { UserTag } from "../../types/user-tags";

export default function UserTagsPage() {
  const { tags, loading, deleteTag } = useUserTags();
  const [selectedTag, setSelectedTag] = useState<UserTag | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<UserTag | null>(null);

  const handleEdit = (tag: UserTag) => {
    setSelectedTag(tag);
    setDialogOpen(true);
  };

  const handleDelete = (tag: UserTag) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tagToDelete) {
      await deleteTag(tagToDelete.id);
      setDeleteDialogOpen(false);
      setTagToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Tags</h2>
          <p className="text-muted-foreground">
            Manage your tags
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <UserTagList
        tags={tags}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <UserTagDialog
          tag={selectedTag}
          onClose={() => {
            setDialogOpen(false);
            setSelectedTag(undefined);
          }}
        />
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tag
              "{tagToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
