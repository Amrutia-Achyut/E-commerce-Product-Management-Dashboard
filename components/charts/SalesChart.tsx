'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SalesChartProps {
  products: Array<{
    name: string;
    sales: number;
  }>;
}

export default function SalesChart({ products }: SalesChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const topProducts = [...products]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    setChartData({
      labels: topProducts.map((p) => p.name),
      datasets: [
        {
          label: 'Sales',
          data: topProducts.map((p) => p.sales),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [products]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 5 Products by Sales',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
}

