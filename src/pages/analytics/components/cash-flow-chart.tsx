import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { filterTransactionsByTimeRange } from '@/lib/analytics';
import type { Transaction } from '@/types/transactions';
import type { TimeRange } from '../index';

Chart.register(...registerables);

interface CashFlowChartProps {
  transactions: Transaction[];
  timeRange: TimeRange;
}

export function CashFlowChart({ transactions, timeRange }: CashFlowChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    
    // Group transactions by date
    const dailyData = filteredTransactions.reduce((acc, transaction) => {
      const date = transaction.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { income: 0, expenses: 0 };
      }
      if (transaction.amount > 0) {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expenses += Math.abs(transaction.amount);
      }
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    // Sort dates and prepare data
    const dates = Object.keys(dailyData).sort();
    const incomeData = dates.map(date => dailyData[date].income);
    const expenseData = dates.map(date => dailyData[date].expenses);

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            borderColor: '#22c55e',
            backgroundColor: '#22c55e20',
            fill: true,
          },
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: '#ef4444',
            backgroundColor: '#ef444420',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(value as number);
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(value)}`;
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
  }, [transactions, timeRange]);

  return (
    <div className="relative aspect-[16/9] w-full">
      <canvas ref={chartRef} />
    </div>
  );
}