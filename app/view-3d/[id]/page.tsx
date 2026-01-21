'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { getProducts } from '@/services/api';
import { Smartphone, AlertTriangle } from 'lucide-react';

// TypeScript Fix for Custom Element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  modelStatus: string;
  modelUrl: string;
}

export default function View3DPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProducts({ search: id });
        const foundProduct = data.products.find((p: Product) => p._id === id);

        if (foundProduct) {
          console.log("🔗 Product Found. Model URL:", foundProduct.modelUrl);
          setProduct(foundProduct);
        } else {
          setError('Product not found in Database');
        }
      } catch (err) {
        setError('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold">Loading Data...</div>;

  if (error || !product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <>
      {/* 1. Model Viewer Library Load - Strategy changed to lazyOnload */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">

          {/* Header Info */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
              <p className="text-emerald-600 font-semibold">{product.category} • ${product.price}</p>
            </div>
            <div className="hidden md:block text-right">
              <span className="text-xs text-slate-400">ID: {product._id}</span>
            </div>
          </div>

          {/* 3D VIEWER AREA - Direct Visibility */}
          <div className="relative w-full h-[500px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
            {product.modelUrl ? (
              <model-viewer
                src={product.modelUrl}
                poster={product.imageUrl}
                alt={product.name}
                ar
                camera-controls
                auto-rotate
                shadow-intensity="1"
                environment-image="neutral"
                // Height ko direct 500px dein testing ke liye
                style={{ width: '100%', height: '500px', backgroundColor: '#f0f0f0', display: 'block' }}
              >
              </model-viewer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500 font-medium">3D Model link is missing in DB!</p>
                <img src={product.imageUrl} alt="Static" className="h-64 mt-4 rounded-xl shadow-lg" />
              </div>
            )}
          </div>

          {/* Footer Instruction */}
          <div className="p-4 bg-slate-800 text-white text-center text-sm">
            Use mouse to rotate • Scroll to zoom • AR works on mobile only
          </div>
        </div>
      </div>
    </>
  );
}