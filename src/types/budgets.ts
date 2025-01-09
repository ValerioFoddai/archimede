import { z } from 'zod';

export const budgetSchema = z.object({
  mainCategoryId: z.number({
    required_error: 'Please select a category',
  }),
  amount: z.string().min(1, 'Amount is required').regex(/^\d+(\.\d{0,2})?$/, {
    message: 'Please enter a valid amount',
  }),
  recurring: z.boolean().default(true),
  startDate: z.date({
    required_error: 'Please select a start date',
  }),
  endDate: z.date().optional(),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

export interface Budget {
  id: string;
  mainCategoryId: number;
  amount: number;
  recurring: boolean;
  startDate: Date;
  endDate?: Date;
  spent: number;
  remaining: number;
  percentageUsed: number;
}