import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Assets</h2>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
      </div>
      <Card>
        <div className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <Wallet className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Exciting Features Coming Soon</h3>
          <p className="text-muted-foreground max-w-lg mx-auto space-y-4">
            <p className="mb-4">
              We're working on powerful new features to help you manage and track all your assets in one place.
            </p>
            <p>
              Soon you'll be able to:
            </p>
            <ul className="list-disc text-left pl-4 mt-2 space-y-2">
              <li>Track multiple types of assets</li>
              <li>Monitor your investments</li>
              <li>View detailed performance analytics</li>
              <li>Generate comprehensive reports</li>
            </ul>
          </p>
        </div>
      </Card>
    </div>
  );
}
