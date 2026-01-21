'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardAnalytics from '@/components/DashboardAnalytics';

export default function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 overflow-auto">
        <DashboardAnalytics />
      </div>
    </div>
  );
}
