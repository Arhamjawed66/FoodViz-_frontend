'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <nav className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">FoodViz Admin</Link>
                <div className="flex items-center">
                    <Link href="/" className="mr-4 hover:text-gray-300 transition-colors">Dashboard</Link>
                    <Link href="/products/new" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors mr-4">Add Product</Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors font-semibold"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
