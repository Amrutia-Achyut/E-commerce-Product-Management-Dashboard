'use client';

import useSWR from 'swr';
import axios from 'axios';
import './dashboard.css';

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

interface StatsCardsProps {
  initialStats: {
    totalProducts: number;
    activeProducts: number;
    totalStock: number;
    totalSales: number;
    lowStockProducts: number;
  };
}

export default function StatsCards({ initialStats }: StatsCardsProps) {
  const { data: stats } = useSWR('/api/stats', fetcher, {
    fallbackData: initialStats,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const displayStats = stats || initialStats;

  const statItems = [
    {
      title: 'Total Products',
      value: displayStats.totalProducts,
      icon: '📦',
      color: '#667eea',
    },
    {
      title: 'Active Products',
      value: displayStats.activeProducts,
      icon: '✅',
      color: '#48bb78',
    },
    {
      title: 'Total Stock',
      value: displayStats.totalStock.toLocaleString(),
      icon: '📊',
      color: '#4299e1',
    },
    {
      title: 'Total Sales',
      value: displayStats.totalSales.toLocaleString(),
      icon: '💰',
      color: '#ed8936',
    },
    {
      title: 'Low Stock Alert',
      value: displayStats.lowStockProducts,
      icon: '⚠️',
      color: '#f56565',
    },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item) => (
        <div key={item.title} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">{item.title}</span>
            <div
              className="stat-card-icon"
              style={{ backgroundColor: `${item.color}20`, color: item.color }}
            >
              {item.icon}
            </div>
          </div>
          <div className="stat-card-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

