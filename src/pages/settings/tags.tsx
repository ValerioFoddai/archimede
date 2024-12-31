import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TagList } from '@/components/tags/tag-list';
import { TagForm } from '@/components/tags/tag-form';
import { useTags } from '@/hooks/useTags';
import { useTagsDebug } from '@/hooks/useTagsDebug';
import { Tag, TagFormData } from '@/types/tags';

export function TagsPage() {
  const { tags, loading, error, createTag, updateTag, deleteTag } = useTags();
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  // Enable debug monitoring in development
  useTagsDebug(tags, loading, error);

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsFormOpen(true);
  };

  const handleDelete = (tag: Tag) => {
    setTagToDelete(tag);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: TagFormData) => {
    if (selectedTag) {
      await updateTag({ ...data, id: selectedTag.id });
    } else {
      await createTag(data);
    }
    setIsFormOpen(false);
    setSelectedTag(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (tagToDelete) {
      await deleteTag(tagToDelete.id);
      setIsDeleteDialogOpen(false);
      setTagToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading tags: {error.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
          <p className="text-muted-foreground">
            Manage your tags to organize your expenses
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <TagList
        tags={tags}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <TagForm
            tag={selectedTag}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedTag(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tag
              "{tagToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}