import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { filterTransactionsByTimeRange } from '@/lib/analytics';
import type { Transaction } from '@/types/transactions';
import type { TimeRange } from '../index';

Chart.register(...registerables);

interface ExpenseCategoryChartProps {
  transactions: Transaction[];
  timeRange: TimeRange;
}

export function ExpenseCategoryChart({ transactions, timeRange }: ExpenseCategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { categories } = useExpenseCategories();

  useEffect(() => {
    if (!chartRef.current) return;

    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    
    // Calculate spending by category, excluding income category (id: 1)
    const categorySpending = categories
      .filter(category => category.id !== 1) // Exclude income category
      .map(category => {
        const spending = filteredTransactions
          .filter(t => t.mainCategoryId === category.id && t.amount < 0) // Only include expenses
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return {
          name: category.name,
          amount: spending,
        };
      })
      .filter(category => category.amount > 0); // Only include categories with spending

    // Sort by amount
    categorySpending.sort((a, b) => b.amount - a.amount);

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categorySpending.map(c => c.name),
        datasets: [{
          data: categorySpending.map(c => c.amount),
          backgroundColor: [
            '#2563eb', // blue
            '#7c3aed', // violet
            '#db2777', // pink
            '#ea580c', // orange
            '#ca8a04', // yellow
            '#65a30d', // lime
            '#0d9488', // teal
            '#0284c7', // light blue
            '#6366f1', // indigo
            '#9333ea', // purple
            '#c026d3', // fuchsia
            '#e11d48', // rose
          ],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(value)} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions, timeRange, categories]);

  return (
    <div className="h-[400px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
}