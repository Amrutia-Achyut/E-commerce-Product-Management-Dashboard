'use client';

import './dashboard.css';

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalStock: number;
    totalSales: number;
    lowStockProducts: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: '#667eea',
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: '✅',
      color: '#48bb78',
    },
    {
      title: 'Total Stock',
      value: stats.totalStock.toLocaleString(),
      icon: '📊',
      color: '#4299e1',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales.toLocaleString(),
      icon: '💰',
      color: '#ed8936',
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockProducts,
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

