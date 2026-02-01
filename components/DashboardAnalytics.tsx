'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement
} from 'chart.js';
import { Box, CheckCircle, Clock, Database, TrendingUp, Activity, Zap } from 'lucide-react';

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
    <div className="p-8 gradient-cool-bg min-h-screen animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black pro-heading-gradient mb-2">FoodViz Analytics</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Live monitoring of your 3D assets on Railway
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-full text-sm font-bold flex items-center shadow-lg border border-emerald-200 dark:border-emerald-800">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse-slow shadow-glow-secondary"></div>
          <Zap className="w-4 h-4 mr-2" />
          Connected to Railway
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard title="Total Products" value={totalProducts} icon={<Box className="text-blue-600" />} color="blue" />
        <StatCard title="Completed Models" value={completedModels} icon={<CheckCircle className="text-green-600" />} color="green" />
        <StatCard title="In Pipeline" value={processingModels} icon={<Clock className="text-orange-600" />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bar Chart */}
        <div className="card-gradient p-8 rounded-3xl shadow-large hover-lift transition-all duration-500">
          <h2 className="text-2xl font-black mb-8 flex items-center text-slate-800 dark:text-slate-200">
            <Database className="mr-3 w-7 h-7 text-blue-500" />
            3D Inventory Status
            <TrendingUp className="ml-auto w-5 h-5 text-emerald-500" />
          </h2>
          <div className="h-80">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    cornerRadius: 8,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(148, 163, 184, 0.1)',
                    },
                    ticks: {
                      color: '#64748b',
                      font: {
                        weight: 'bold'
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: '#64748b',
                      font: {
                        weight: 'bold'
                      }
                    }
                  }
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuart'
                }
              }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card-gradient p-8 rounded-3xl shadow-large hover-lift transition-all duration-500">
          <h2 className="text-2xl font-black mb-8 text-slate-800 dark:text-slate-200">Menu Distribution</h2>
          <div className="h-80">
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
                      font: {
                        size: 12,
                        weight: 'bold'
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    cornerRadius: 8,
                  }
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuart'
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable StatCard Component for Professional Look
function StatCard({ title, value, icon, color }: any) {
  const gradients: any = {
    blue: "gradient-primary-bg",
    green: "gradient-secondary-bg",
    orange: "gradient-accent-bg"
  };

  const borders: any = {
    blue: "border-blue-200 dark:border-blue-800",
    green: "border-green-200 dark:border-green-800",
    orange: "border-orange-200 dark:border-orange-800"
  };

  return (
    <div className={`card-gradient p-8 rounded-3xl border ${borders[color]} shadow-large hover-lift transition-all duration-500 group`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 ${gradients[color]} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {title}
        </span>
      </div>
      <div className="text-5xl font-black text-slate-800 dark:text-slate-200 mb-2 animate-slide-up">
        {value}
      </div>
      <div className={`h-1 ${gradients[color]} rounded-full opacity-60`}></div>
    </div>
  );
}
