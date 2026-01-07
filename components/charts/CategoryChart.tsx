'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  categoryStats: Array<{
    category: string;
    count: number;
    totalSales: number;
  }>;
}

export default function CategoryChart({ categoryStats }: CategoryChartProps) {
  // Filter out null/undefined categories and create a stable data structure
  const filteredStats = useMemo(() => {
    return categoryStats.filter((cat) => cat.category && cat.category.trim() !== '');
  }, [categoryStats]);

  // Create chart data with a key based on the data to force updates
  const chartData = useMemo(() => {
    if (!filteredStats || filteredStats.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(200, 200, 200, 0.8)'],
          },
        ],
      };
    }

    const colors = [
      'rgba(102, 126, 234, 0.8)',
      'rgba(72, 187, 120, 0.8)',
      'rgba(66, 153, 225, 0.8)',
      'rgba(237, 137, 54, 0.8)',
      'rgba(245, 101, 101, 0.8)',
      'rgba(167, 85, 247, 0.8)',
    ];

    return {
      labels: filteredStats.map((cat) => cat.category),
      datasets: [
        {
          data: filteredStats.map((cat) => cat.count),
          backgroundColor: colors.slice(0, filteredStats.length),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [filteredStats]);

  // Create a unique key based on the data to force re-render
  const chartKey = useMemo(() => {
    return JSON.stringify(filteredStats.map((cat) => `${cat.category}-${cat.count}`));
  }, [filteredStats]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Products by Category',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  }), []);

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="chart-container">
      <Doughnut key={chartKey} data={chartData} options={options} />
    </div>
  );
}

