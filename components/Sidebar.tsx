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
  const pathname = usePathname();

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
    <div className={`gradient-ocean-bg text-white h-screen flex flex-col transition-all duration-500 shadow-2xl ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header & Toggle */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <span className="font-black text-2xl tracking-wider pro-text-gradient animate-fade-in">
            FOODVIZ
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer hover-lift"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Primary Action: Add Product */}
      <div className="px-4 mb-6">
        <Link href="/products/new">
          <div className="btn-gradient-secondary flex items-center justify-center p-4 rounded-2xl transition-all duration-300 cursor-pointer shadow-xl hover-lift group">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            {!isCollapsed && (
              <span className="ml-3 font-bold text-lg tracking-wide">New Product</span>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 cursor-pointer group animate-slide-up ${
                isActive
                  ? 'bg-white/20 text-white border-l-4 border-white shadow-lg backdrop-blur-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                {!isCollapsed && (
                  <span className="ml-4 font-semibold text-lg tracking-wide">{item.name}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-5 py-4 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-2xl transition-all duration-300 cursor-pointer hover-lift group"
        >
          <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
          {!isCollapsed && (
            <span className="ml-4 font-semibold text-lg tracking-wide">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
