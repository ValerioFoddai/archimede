import { Card } from "../../../components/ui/card";

export default function TestPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Test page content</p>
        </div>
      </Card>
    </div>
  );
}
