export const toastMessages = {
  create: (name: string) => ({
    title: "Success",
    description: `Tag '${name}' created successfully`,
    variant: "default" as const,
  }),
  update: (oldName: string, newName: string) => ({
    title: "Success",
    description: `Tag '${oldName}' updated to '${newName}'`,
    variant: "default" as const,
  }),
  delete: (name: string) => ({
    title: "Success",
    description: `Tag '${name}' deleted`,
    variant: "default" as const,
  }),
  undo: {
    create: {
      title: "Success",
      description: "Creation undone successfully",
      variant: "default" as const,
    },
    update: {
      title: "Success",
      description: "Update undone successfully",
      variant: "default" as const,
    },
    delete: {
      title: "Success",
      description: "Deletion undone successfully",
      variant: "default" as const,
    },
  },
  error: (operation: string, message: string) => ({
    title: "Error",
    description: `Failed to ${operation}: ${message}`,
    variant: "destructive" as const,
  }),
};