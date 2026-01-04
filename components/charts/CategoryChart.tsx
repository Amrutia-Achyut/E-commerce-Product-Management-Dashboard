'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  categoryStats: Array<{
    category: string;
    count: number;
    totalSales: number;
  }>;
}

export default function CategoryChart({ categoryStats }: CategoryChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (categoryStats.length === 0) {
      setChartData({
        labels: ['No Data'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(200, 200, 200, 0.8)'],
          },
        ],
      });
      return;
    }

    const colors = [
      'rgba(102, 126, 234, 0.8)',
      'rgba(72, 187, 120, 0.8)',
      'rgba(66, 153, 225, 0.8)',
      'rgba(237, 137, 54, 0.8)',
      'rgba(245, 101, 101, 0.8)',
      'rgba(167, 85, 247, 0.8)',
    ];

    setChartData({
      labels: categoryStats.map((cat) => cat.category),
      datasets: [
        {
          data: categoryStats.map((cat) => cat.count),
          backgroundColor: colors.slice(0, categoryStats.length),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    });
  }, [categoryStats]);

  const options = {
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
  };

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

