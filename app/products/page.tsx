'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, deleteProduct } from '@/services/api';
import QRCode from 'qrcode.react';
import Sidebar from '@/components/Sidebar';
import { Box, Eye } from 'lucide-react';

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

export default function ProductsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsPerPage = 9;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        category: filter || undefined,
        search: search || undefined,
        page: currentPage,
        limit: itemsPerPage
      };
      const data = await getProducts(filters);
      setProducts(data.products);
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
  }, [filter]);

  useEffect(() => {
    const generateQRCodes = () => {
      const newQrCodes: { [key: string]: string } = {};
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
      for (const product of products) {
        newQrCodes[product._id] = `${frontendUrl}/view-3d/${product._id}`;
      }
      setQrCodes(newQrCodes);
    };
    if (products.length > 0) {
      generateQRCodes();
    }
  }, [products]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <Link href="/products/new">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                Add New Product
              </button>
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Dasi Food">Dasi Food</option>
              <option value="Chinese Food">Chinese Food</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Junk Food">Junk Food</option>
            </select>
          </div>

          {loading && <p className="text-center text-gray-600">Loading products...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => {
              const qrCodeUrl = qrCodes[product._id];
              return (
                <div key={product._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] min-h-80 overflow-hidden">
                  <div className="relative h-40 mb-4 overflow-hidden rounded-xl group">
                    <img
                      src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5004${product.imageUrl}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg backdrop-blur-sm ${product.modelStatus === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                            product.modelStatus === 'failed' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'
                          }`}>
                      {product.modelStatus.toUpperCase()}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">{product.name}</h2>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 font-medium bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full text-sm border border-blue-100">{product.category}</p>
                      <p className="text-xl font-bold text-emerald-600">${product.price}</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md font-medium">
                        ID: {product.barcode || 'N/A'}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/convert-3d?imageUrl=${encodeURIComponent(product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5004${product.imageUrl}`)}&productId=${product._id}`}>
                          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-1 text-sm">
                            <Box className="w-3.5 h-3.5" />
                            3D
                          </button>
                        </Link>
                        {product.modelStatus === 'completed' && (
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-1 text-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {qrCodeUrl && (
                      <div className="flex justify-center pt-3 border-t border-gray-100">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded-lg shadow-inner border border-gray-200">
                          <QRCode value={qrCodeUrl} size={80} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(Math.ceil(filteredProducts.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 3D Preview Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedProduct.name} - 3D Preview</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="w-full h-96">
              <model-viewer
                src={selectedProduct.modelUrl}
                alt={selectedProduct.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                style={{ width: '100%', height: '100%' }}
              ></model-viewer>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
