import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Product from '@/models/Product';

// GET dashboard statistics
export async function GET() {
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

    const stats = {
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

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

