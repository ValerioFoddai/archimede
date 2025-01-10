import { Toast, ToastAction } from "@/components/ui/toast";
import { Tag } from "@/types/tags";

interface TagToastProps {
  action: 'create' | 'update' | 'delete';
  tag: Tag;
  previousTag?: Tag;
  onUndo?: () => Promise<void>;
}

export function TagToast({ action, tag, previousTag, onUndo }: TagToastProps) {
  const getToastContent = () => {
    switch (action) {
      case 'create':
        return `Tag '${tag.name}' created successfully`;
      case 'update':
        return `Tag '${previousTag?.name}' updated to '${tag.name}'`;
      case 'delete':
        return `Tag '${tag.name}' deleted`;
      default:
        return '';
    }
  };

  return (
    <Toast>
      <div className="grid gap-1">
        <div className="font-medium">
          {getToastContent()}
        </div>
      </div>
      {onUndo && (
        <ToastAction altText="Undo" onClick={onUndo}>
          Undo
        </ToastAction>
      )}
    </Toast>
  );
}
