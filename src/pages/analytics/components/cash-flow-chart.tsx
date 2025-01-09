import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
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
      const date = format(transaction.date, 'MMM dd');
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
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Money In',
            data: incomeData,
            backgroundColor: '#22c55e',
            borderRadius: 4,
          },
          {
            label: 'Money Out',
            data: expenseData,
            backgroundColor: '#ef4444',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
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
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              borderRadius: 4,
            },
          },
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
    <div className="relative h-[200px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
}