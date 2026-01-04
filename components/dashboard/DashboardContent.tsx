'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './dashboard.css';

interface DashboardContentProps {
  children: ReactNode;
}

export default function DashboardContent({ children }: DashboardContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>E-Commerce Admin</h2>
        </div>
        <div className="nav-links">
          <Link href="/dashboard" className="nav-link active">
            Dashboard
          </Link>
          <Link href="/dashboard/products/new" className="nav-link">
            Add Product
          </Link>
          <button
            onClick={handleLogout}
            className="logout-button"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}

