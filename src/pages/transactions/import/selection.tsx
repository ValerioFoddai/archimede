import { Link } from "react-router-dom";
import { FileSpreadsheet, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export function ImportSelectionPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Import Transactions</h2>
          <p className="text-muted-foreground">
            Choose how you want to import your transactions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Banca Sella Import */}
          <Link to="/transactions/import/banca-sella">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Banca Sella</CardTitle>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Beta</span>
                  </div>
                  <CardDescription className="text-sm">
                    Import transactions directly from your Banca Sella CSV export
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Fineco Bank Import */}
          <Link to="/transactions/import/fineco">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Fineco</CardTitle>
                  <CardDescription className="text-sm">
                    Import transactions directly from your Fineco XLSX export
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Hype Bank Import */}
          <Link to="/transactions/import/hype">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Hype</CardTitle>
                  <CardDescription className="text-sm">
                    Import transactions directly from your Hype CSV export
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Revolut Import */}
          <Link to="/transactions/import/revolut">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Revolut</CardTitle>
                  <CardDescription className="text-sm">
                    Import transactions directly from your Revolut CSV export
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Custom CSV Import (always last) */}
          <Link to="/transactions/import/custom">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Custom CSV</CardTitle>
                  <CardDescription className="text-sm">
                    Import transactions from any CSV file with custom column mapping
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" asChild>
            <Link to="/transactions">Cancel</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
