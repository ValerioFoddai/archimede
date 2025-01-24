import { z } from 'zod';

export type TimeRange = 
  | `month-${string}` // Format: month-YYYY-MM for specific month (e.g., month-2024-03)
  | `custom-${string}-${string}`; // Format: custom-YYYY-MM-DD-YYYY-MM-DD for custom date range

export const transactionSchema = z.object({
  date: z.date({
    required_error: 'Please select a date',
  }),
  merchant: z.string().min(1, 'Merchant name is required'),
  amount: z.string().min(1, 'Amount is required').regex(/^-?\d*\.?\d{0,2}$/, {
    message: 'Please enter a valid amount',
  }),
  mainCategoryId: z.number().optional(),
  subCategoryId: z.number().optional(),
  tagIds: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
  bankAccountId: z.string().optional().nullable(),
}).refine((data) => {
  return (data.mainCategoryId === undefined && data.subCategoryId === undefined) ||
         (data.mainCategoryId !== undefined && data.subCategoryId !== undefined);
}, {
  message: "Main category and sub-category must be selected together",
  path: ["mainCategoryId"],
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export interface Transaction {
  id: string;
  date: Date;
  merchant: string;
  amount: number;
  mainCategoryId?: number;
  subCategoryId?: number;
  tagIds?: string[];
  notes?: string;
  bankAccountId?: string | null;
  bankAccount?: string | null; // Display name from the view
  userId: string;
  createdAt: string;
}

export interface ColumnVisibility {
  category: boolean;
  tags: boolean;
  notes: boolean;
  bankAccount: boolean;
}
