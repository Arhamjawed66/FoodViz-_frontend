'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Bell, Search, Globe } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            {/* Left Section: Search Bar */}
            <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg w-96">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search products, orders..." 
                    className="bg-transparent border-none outline-none text-sm text-slate-600 w-full"
                />
            </div>

            {/* Right Section: Status & Actions */}
            <div className="flex items-center gap-6">
                {/* Railway Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Cloud Live</span>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-slate-200"></div>

                {/* Icons */}
                <div className="flex items-center gap-4 text-slate-500">
                    <button className="hover:text-blue-600 transition-colors cursor-pointer">
                        <Globe className="w-5 h-5" />
                    </button>
                    <button className="hover:text-blue-600 transition-colors relative cursor-pointer">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-3 ml-2 border-l pl-6 border-slate-200">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        A
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">Admin</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Superuser</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}