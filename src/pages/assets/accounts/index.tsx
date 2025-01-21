import { Card } from "../../../components/ui/card";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Account content will go here */}
          <p className="text-sm text-muted-foreground">No accounts found. Add an account to get started.</p>
        </div>
      </Card>
    </div>
  );
}
