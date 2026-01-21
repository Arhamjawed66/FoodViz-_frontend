'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  modelStatus: string;
  modelUrl: string;
  barcode: string;
  qrCode?: string;
}

export default function DashboardAnalytics() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalProducts = products.length;
  const newModels = products.filter(p => p.modelStatus === 'completed').length;
  const activeAssets = products.filter(p => p.modelStatus === 'processing').length;

  const chartData = {
    labels: ['Total Products', 'New Models', 'Active 3D Assets'],
    datasets: [
      {
        label: 'Count',
        data: [totalProducts, newModels, activeAssets],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Products by Category',
        data: Object.values(categoryCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">New Models</h2>
          <p className="text-3xl font-bold text-green-600">{newModels}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Active 3D Assets</h2>
          <p className="text-3xl font-bold text-yellow-600">{activeAssets}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <Bar data={chartData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
        <div className="flex justify-center">
          <div className="w-96 h-96">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}
    </div>
  );
}
