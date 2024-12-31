export const toastMessages = {
  create: (name: string) => ({
    title: "Success",
    description: `Tag '${name}' created successfully`,
  }),
  update: (oldName: string, newName: string) => ({
    title: "Success",
    description: `Tag '${oldName}' updated to '${newName}'`,
  }),
  delete: (name: string) => ({
    title: "Success",
    description: `Tag '${name}' deleted`,
  }),
  undo: {
    create: {
      title: "Success",
      description: "Creation undone successfully",
    },
    update: {
      title: "Success",
      description: "Update undone successfully",
    },
    delete: {
      title: "Success",
      description: "Deletion undone successfully",
    },
  },
  error: (operation: string, message: string) => ({
    title: "Error",
    description: `Failed to ${operation}: ${message}`,
    variant: "destructive" as const,
  }),
};