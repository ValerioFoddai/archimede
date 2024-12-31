import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";
import {
  useToast as useToastBase,
  toast as toastBase,
} from "@/components/ui/use-toast";

export interface ToastData extends Omit<ToastProps, "id"> {
  id?: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
}

export function useToast() {
  const { toast, dismiss, ...rest } = useToastBase();

  return {
    toast: (data: ToastData) => {
      toast({
        ...data,
        duration: 5000, // 5 seconds
      });
    },
    dismiss,
    ...rest,
  };
}