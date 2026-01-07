'use client';

import useSWR from 'swr';
import axios from 'axios';
import SalesChart from './SalesChart';
import StockChart from './StockChart';
import CategoryChart from './CategoryChart';
import '../dashboard/dashboard.css';

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

interface ChartsSectionProps {
  initialStats: {
    categoryStats: Array<{
      category: string;
      count: number;
      totalSales: number;
      totalStock: number;
    }>;
  };
  initialProducts: Array<{
    name: string;
    sales: number;
    stock: number;
  }>;
}

export default function ChartsSection({ initialStats, initialProducts }: ChartsSectionProps) {
  const { data: stats } = useSWR('/api/stats', fetcher, {
    fallbackData: initialStats,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const { data: products } = useSWR('/api/products', fetcher, {
    fallbackData: initialProducts,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });
  if (!stats || !products) {
    return (
      <div className="charts-section">
        <h2>Analytics & Insights</h2>
        <div>Loading charts...</div>
      </div>
    );
  }

  return (
    <div className="charts-section">
      <h2>Analytics & Insights</h2>
      <div className="charts-grid">
        <SalesChart products={products} />
        <StockChart products={products} />
        <CategoryChart categoryStats={stats.categoryStats} />
      </div>
    </div>
  );
}

