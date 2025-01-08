import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

export function TestTablePage() {
  const mockData = [
    { id: 1, date: '2024-03-19', merchant: 'Test Store', amount: '$100.00' },
    { id: 2, date: '2024-03-18', merchant: 'Another Store', amount: '$75.50' },
    { id: 3, date: '2024-03-17', merchant: 'Sample Shop', amount: '$250.00' },
  ];

  return (
    <div className="p-8">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.merchant}</TableCell>
                <TableCell className="text-right">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
