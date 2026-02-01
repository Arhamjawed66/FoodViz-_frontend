'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Bell, Search, Globe, Wifi } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <header className="h-20 card-gradient border-b border-slate-200/50 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xl backdrop-blur-md">
            {/* Left Section: Search Bar */}
            <div className="flex items-center input-gradient px-4 py-3 rounded-2xl w-96 shadow-lg">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search products, orders..."
                    className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder-slate-400 focus-ring-gradient"
                />
            </div>

            {/* Right Section: Status & Actions */}
            <div className="flex items-center gap-6">
                {/* Railway Status Indicator */}
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider animate-pulse-slow">
                        Cloud Live
                    </span>
                </div>

                {/* Vertical Divider */}
                <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>

                {/* Icons */}
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-300 cursor-pointer hover-lift">
                        <Globe className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-xl transition-all duration-300 cursor-pointer hover-lift relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 animate-bounce-subtle shadow-lg"></span>
                    </button>
                </div>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-4 ml-2 border-l border-slate-200 dark:border-slate-700 pl-6">
                    <div className="w-10 h-10 gradient-primary-bg text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg hover-lift transition-all duration-300">
                        A
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">Admin</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mt-1 tracking-wider">Superuser</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-4 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 cursor-pointer hover-lift group"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </header>
    );
}
