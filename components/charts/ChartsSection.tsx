'use client';

import SalesChart from './SalesChart';
import StockChart from './StockChart';
import CategoryChart from './CategoryChart';
import '../dashboard/dashboard.css';

interface ChartsSectionProps {
  stats: {
    categoryStats: Array<{
      category: string;
      count: number;
      totalSales: number;
      totalStock: number;
    }>;
  };
  products: Array<{
    name: string;
    sales: number;
    stock: number;
  }>;
}

export default function ChartsSection({ stats, products }: ChartsSectionProps) {
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

