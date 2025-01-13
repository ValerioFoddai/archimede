import { z } from 'zod';

export type TimeRange = string; // Format: '7d' for last 7 days or 'month-YYYY-MM' for specific month

export const transactionSchema = z.object({
  bankId: z.string().optional(),
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
  bankId?: string;
  date: Date;
  merchant: string;
  amount: number;
  mainCategoryId?: number;
  subCategoryId?: number;
  tagIds?: string[];
  notes?: string;
  userId: string;
  createdAt: string;
}

export interface ColumnVisibility {
  bank: boolean;
  category: boolean;
  tags: boolean;
  notes: boolean;
}
