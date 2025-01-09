import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { filterTransactionsByTimeRange } from '@/lib/analytics';
import type { Transaction } from '@/types/transactions';
import type { TimeRange } from '../index';

Chart.register(...registerables);

interface SubCategoryChartProps {
  transactions: Transaction[];
  timeRange: TimeRange;
  mainCategoryId?: number;
}

export function SubCategoryChart({ transactions, timeRange, mainCategoryId }: SubCategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { categories } = useExpenseCategories();

  useEffect(() => {
    if (!chartRef.current || !mainCategoryId) return;

    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    const mainCategory = categories.find(c => c.id === mainCategoryId);
    
    if (!mainCategory) return;

    // Calculate spending by subcategory
    const subCategorySpending = mainCategory.sub_categories.map(subCategory => {
      const spending = filteredTransactions
        .filter(t => 
          t.mainCategoryId === mainCategoryId && 
          t.subCategoryId === subCategory.id && 
          t.amount < 0
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return {
        name: subCategory.name,
        amount: spending,
      };
    }).filter(category => category.amount > 0);

    // Sort by amount
    subCategorySpending.sort((a, b) => b.amount - a.amount);

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: subCategorySpending.map(c => c.name),
        datasets: [{
          data: subCategorySpending.map(c => c.amount),
          backgroundColor: '#2563eb',
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(value);
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              callback: (value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'EUR',
                  notation: 'compact',
                }).format(value as number);
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
  }, [transactions, timeRange, mainCategoryId, categories]);

  return (
    <div className="h-[400px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
}