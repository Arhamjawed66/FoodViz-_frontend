'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, deleteProduct } from '@/services/api';
import QRCode from 'qrcode.react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Box, Eye, Trash2, Plus, Search, Loader2, Download, ExternalLink } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  modelStatus: string;
  modelUrl: string;
  barcode: string;
}

export default function ProductsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Railway Configuration
  const BACKEND_URL = 'https://foodviz-backend-production.up.railway.app';
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://foodviz-app.vercel.app';

  const getFullImageUrl = (path: string) => {
    if (!path) return '/placeholder-food.png';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    fetchProducts();
    
    // Auto-refresh for 3D conversion status (Every 20 seconds)
    const interval = setInterval(fetchProducts, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === '' || p.category === filter)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Inventory</h1>
              <p className="text-slate-500">Live products from Railway Backend</p>
            </div>
            <Link href="/products/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95">
                <Plus className="w-5 h-5" /> Add New Product
              </button>
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[280px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-xl outline-none font-bold text-slate-600 focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Desi Food">Desi Food</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-80">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-400 font-medium italic">Loading your Railway database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-48">
                    <img
                      src={getFullImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${
                      product.modelStatus === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'
                    }`}>
                      {product.modelStatus}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h2 className="font-bold text-slate-800 text-lg line-clamp-1">{product.name}</h2>
                      <p className="text-blue-500 text-xs font-bold uppercase tracking-wider">{product.category}</p>
                    </div>

                    <div className="flex items-center justify-between mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="bg-white p-1 rounded-lg">
                        <QRCode value={`${FRONTEND_URL}/view-3d/${product._id}`} size={55} />
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900">${product.price}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Scan for AR</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <Link href={`/convert-3d?imageUrl=${encodeURIComponent(getFullImageUrl(product.imageUrl))}&productId=${product._id}`} className="contents">
                        <button className="flex flex-col items-center gap-1 p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                          <Box className="w-4 h-4" />
                          <span className="text-[9px] font-bold uppercase">Generate</span>
                        </button>
                      </Link>

                      <button 
                        onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                        disabled={product.modelStatus !== 'completed'}
                        className="flex flex-col items-center gap-1 p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-20"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase">Preview</span>
                      </button>

                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="flex flex-col items-center gap-1 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 3D Preview Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-10 bg-white/80 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all shadow-md"
            >
              <Plus className="w-6 h-6 rotate-45" />
            </button>

            <div className="flex-1 bg-slate-100 min-h-[300px] lg:min-h-full">
              {/* @ts-ignore */}
              <model-viewer
                src={selectedProduct.modelUrl}
                alt={selectedProduct.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div className="w-full lg:w-80 p-8 flex flex-col border-l border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                  {selectedProduct.category}
                </span>
              </div>
              
              <div className="space-y-4 mb-auto">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 text-sm font-medium">AR Ready</span>
                  <span className="text-emerald-500 font-bold text-sm underline flex items-center gap-1">
                    YES <Box className="w-3 h-3" />
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Download Asset
                </button>
                <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-tighter">
                  Compatible with iOS QuickLook & Android WebXR
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}