'use client';

import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';
import '../dashboard/dashboard.css';
import './products.css';

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sku: string;
  status: string;
  sales: number;
}

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const { data: products, mutate } = useSWR<Product[]>('/api/products', fetcher, {
    fallbackData: initialProducts,
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${id}`);
      mutate();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="products-section">
        <div className="products-header">
          <h2>Products</h2>
          <Link href="/dashboard/products/new" className="btn btn-primary">
            Add New Product
          </Link>
        </div>
        <div className="empty-state">
          <p>No products found. Create your first product!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-section">
      <div className="products-header">
        <h2>Recent Products</h2>
        <Link href="/dashboard/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <div className="product-image-placeholder">No Image</div>
              )}
              <span className={`product-status ${product.status}`}>
                {product.status}
              </span>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <div className="product-detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">${product.price.toFixed(2)}</span>
                </div>
                <div className="product-detail-item">
                  <span className="detail-label">Stock:</span>
                  <span className={`detail-value ${product.stock < 10 ? 'low-stock' : ''}`}>
                    {product.stock}
                  </span>
                </div>
                <div className="product-detail-item">
                  <span className="detail-label">Sales:</span>
                  <span className="detail-value">{product.sales}</span>
                </div>
                <div className="product-detail-item">
                  <span className="detail-label">SKU:</span>
                  <span className="detail-value">{product.sku}</span>
                </div>
              </div>
              <div className="product-actions">
                <Link
                  href={`/dashboard/products/${product._id}/edit`}
                  className="btn btn-secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

