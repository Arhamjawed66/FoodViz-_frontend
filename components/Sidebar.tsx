'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Package, Plus, FolderOpen, Box, Settings, User, LogOut, BarChart } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
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
    <div className={`bg-gray-800 text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-gray-300 cursor-pointer"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer">
              <item.icon className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </div>
          </Link>
        ))}
      </nav>
      
    </div>
  );
}
