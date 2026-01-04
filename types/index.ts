export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sku: string;
  status: 'active' | 'inactive';
  sales: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  totalSales: number;
  lowStockProducts: number;
  categoryStats: CategoryStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
  totalSales: number;
  totalStock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

