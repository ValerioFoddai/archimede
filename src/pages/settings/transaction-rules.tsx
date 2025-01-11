import { useState, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
import { TransactionRuleForm } from "./components/transaction-rule-form";
import { useTransactionRules } from "../../hooks/useTransactionRules";
import { TransactionRule, TransactionRuleFormData } from "../../types/transaction-rules";

export default function TransactionRules() {
  const { rules, loading, createRule, updateRule, deleteRule } = useTransactionRules();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TransactionRule | null>(null);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  const handleCreateRule = useCallback(async (data: TransactionRuleFormData) => {
    await createRule(data);
    setIsCreateDialogOpen(false);
  }, [createRule]);

  const handleUpdateRule = useCallback(async (data: TransactionRuleFormData) => {
    if (editingRule) {
      await updateRule(editingRule.id, data);
      setEditingRule(null);
    }
  }, [editingRule, updateRule]);

  const handleDeleteRule = useCallback(async () => {
    if (deletingRuleId) {
      await deleteRule(deletingRuleId);
      setDeletingRuleId(null);
    }
  }, [deletingRuleId, deleteRule]);

  const handleOpenCreate = useCallback(() => setIsCreateDialogOpen(true), []);
  const handleCloseCreate = useCallback(() => setIsCreateDialogOpen(false), []);
  const handleCloseEdit = useCallback(() => setEditingRule(null), []);
  const handleCloseDelete = useCallback(() => setDeletingRuleId(null), []);
  const handleEditRule = useCallback((rule: TransactionRule) => setEditingRule(rule), []);
  const handleDeleteRuleClick = useCallback((id: string) => setDeletingRuleId(id), []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transaction Rules</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create rules to automatically categorize transactions based on merchant names
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keywords</TableHead>
              <TableHead>Main Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No rules found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.keywords}</TableCell>
                  <TableCell>{rule.main_category}</TableCell>
                  <TableCell>{rule.sub_category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRuleClick(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Rule</DialogTitle>
          </DialogHeader>
          <TransactionRuleForm
            onSubmit={handleCreateRule}
            onCancel={handleCloseCreate}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingRule} onOpenChange={handleCloseEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
          </DialogHeader>
          {editingRule && (
            <TransactionRuleForm
              defaultValues={editingRule}
              onSubmit={handleUpdateRule}
              onCancel={handleCloseEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingRuleId} onOpenChange={handleCloseDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRule}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
