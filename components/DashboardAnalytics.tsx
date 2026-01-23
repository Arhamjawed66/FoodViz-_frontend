'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement
} from 'chart.js';
import { Box, CheckCircle, Clock, Database } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Product {
  id: string;
  name: string;
  category: string;
  modelStatus: 'completed' | 'processing' | 'pending';
  // Add other properties as needed
}

export default function DashboardAnalytics() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
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
    // 5 sec ke bajaye 30 sec karein (Professional Standard)
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalProducts = products.length;
  const completedModels = products.filter(p => p.modelStatus === 'completed').length;
  const processingModels = products.filter(p => p.modelStatus === 'processing' || p.modelStatus === 'pending').length;

  const pendingModels = products.filter(p => p.modelStatus === 'pending').length;
  const processingOnly = products.filter(p => p.modelStatus === 'processing').length;

  const chartData = {
    labels: ['Completed', 'Processing', 'Pending'],
    datasets: [{
      label: 'Models',
      data: [completedModels, processingOnly, pendingModels],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
    }]
  };

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      data: Object.values(categoryCounts),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FoodViz Analytics</h1>
          <p className="text-gray-500">Live monitoring of your 3D assets on Railway</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Connected to Railway
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Products" value={totalProducts} icon={<Box className="text-blue-600" />} color="blue" />
        <StatCard title="Completed Models" value={completedModels} icon={<CheckCircle className="text-green-600" />} color="green" />
        <StatCard title="In Pipeline" value={processingModels} icon={<Clock className="text-orange-600" />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Database className="mr-2 w-5 h-5" /> 3D Inventory Status
          </h2>
          <div className="h-80">
            <Bar 
              data={chartData} 
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Menu Distribution</h2>
          <div className="h-80">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable StatCard Component for Professional Look
function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
    orange: "bg-orange-50 border-orange-100"
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
      </div>
      <div className="text-4xl font-black text-gray-800">{value}</div>
    </div>
  );
}