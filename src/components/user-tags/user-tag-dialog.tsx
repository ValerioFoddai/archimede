import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useUserTags } from "../../hooks/useUserTags";
import { UserTag } from "../../types/user-tags";

interface UserTagDialogProps {
  tag?: UserTag;
  onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
}

export function UserTagDialog({ tag, onClose }: UserTagDialogProps) {
  const { createTag, updateTag } = useUserTags();
  const form = useForm<FormData>({
    defaultValues: {
      name: tag?.name || "",
      description: tag?.description || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (tag) {
        await updateTag({
          id: tag.id,
          ...data,
        });
      } else {
        await createTag(data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving tag:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{tag ? "Edit Tag" : "Create Tag"}</DialogTitle>
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {tag ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
