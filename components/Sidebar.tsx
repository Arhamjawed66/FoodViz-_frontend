'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Package, Plus, FolderOpen, Settings, LogOut, BarChart 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname(); // Active link highlight karne ke liye

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Analytics', href: '/', icon: BarChart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: FolderOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className={`bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header & Toggle */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && <span className="font-bold text-xl tracking-wider text-blue-400">FOODVIZ</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Primary Action: Add Product */}
      <div className="px-4 mb-6">
        <Link href="/products/add">
          <div className={`flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all cursor-pointer shadow-lg shadow-blue-900/20`}>
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3 font-semibold">New Product</span>}
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center px-4 py-3 rounded-lg transition-all cursor-pointer ${
                isActive ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}>
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-4 font-medium">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-4 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}