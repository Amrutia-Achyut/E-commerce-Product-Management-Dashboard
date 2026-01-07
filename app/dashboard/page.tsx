import { Suspense } from 'react';
import connectDB from '@/lib/db/connect';
import Product from '@/models/Product';
import DashboardContent from '@/components/dashboard/DashboardContent';
import StatsCards from '@/components/dashboard/StatsCards';
import ProductList from '@/components/products/ProductList';
import ChartsSection from '@/components/charts/ChartsSection';

async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getStats() {
  try {
    await connectDB();
    const [
      totalProducts,
      activeProducts,
      totalStock,
      totalSales,
      lowStockProducts,
      categoryStats,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$stock' },
          },
        },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$sales' },
          },
        },
      ]),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalSales: { $sum: '$sales' },
            totalStock: { $sum: '$stock' },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      totalProducts,
      activeProducts,
      totalStock: totalStock[0]?.total || 0,
      totalSales: totalSales[0]?.total || 0,
      lowStockProducts,
      categoryStats: categoryStats.map((cat) => ({
        category: cat._id,
        count: cat.count,
        totalSales: cat.totalSales,
        totalStock: cat.totalStock,
      })),
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalStock: 0,
      totalSales: 0,
      lowStockProducts: 0,
      categoryStats: [],
    };
  }
}

export default async function DashboardPage() {
  const [products, stats] = await Promise.all([getProducts(), getStats()]);

  return (
    <DashboardContent>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Product Management Dashboard</h1>
          <p>Manage your e-commerce products efficiently</p>
        </header>

        <Suspense fallback={<div>Loading stats...</div>}>
          <StatsCards initialStats={stats} />
        </Suspense>

        <Suspense fallback={<div>Loading charts...</div>}>
          <ChartsSection initialStats={stats} initialProducts={products} />
        </Suspense>

        <Suspense fallback={<div>Loading products...</div>}>
          <ProductList initialProducts={products} />
        </Suspense>
      </div>
    </DashboardContent>
  );
}

