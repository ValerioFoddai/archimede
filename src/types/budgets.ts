import { z } from 'zod';

export const budgetSchema = z.object({
  mainCategoryId: z.number({
    required_error: 'Please select a category',
  }),
  amount: z.string().min(1, 'Amount is required').regex(/^\d+(\.\d{0,2})?$/, {
    message: 'Please enter a valid amount',
  }),
  startDate: z.date({
    required_error: 'Please select a start date',
  }),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

export interface DbBudget {
  id: string;
  user_id: string;
  main_category_id: number;
  amount: number;
  start_date: string;
  end_date?: string;
}

export interface Budget {
  id: string;
  mainCategoryId: number;
  amount: number;
  startDate: Date;
  endDate?: Date;
  spent: number;
  remaining: number;
  percentageUsed: number;
}
