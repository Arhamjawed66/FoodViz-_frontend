'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { getProducts } from '@/services/api';
import { Smartphone, AlertTriangle, RotateCcw } from 'lucide-react';

// TypeScript Fix
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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-bold">
      <div className="animate-pulse text-emerald-400 text-xl">Loading 3D Environment...</div>
    </div>
  );

  if (error || !product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-bold">{error}</h1>
      </div>
    );
  }

  // Check if product is food for steam effect
  const isHotFood = product.category.toLowerCase().includes('biryani') || 
                    product.name.toLowerCase().includes('meat') ||
                    product.category.toLowerCase().includes('food');

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
      />

      {/* --- CSS Animations for Steam/Smoke --- */}
      <style jsx global>{`
        @keyframes steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          15% { opacity: 0.4; }
          50% { transform: translateY(-50px) scaleX(1.5); opacity: 0.2; }
          100% { transform: translateY(-120px) scaleX(2); opacity: 0; }
        }
        .steam-particle {
          position: absolute;
          bottom: 40%;
          left: 50%;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          filter: blur(15px);
          animation: steam 3s infinite ease-out;
          pointer-events: none;
          z-index: 20;
        }
      `}</style>

      <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-[#1e293b] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-700">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-full text-sm font-bold">
                  {product.category}
                </span>
                <span className="text-slate-400 font-medium">PKR {product.price}</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="p-3 bg-slate-700 rounded-full text-slate-300 hover:bg-emerald-500 hover:text-white transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* 3D VIEWER AREA */}
          <div className="relative w-full h-[550px] bg-[#111] overflow-hidden">
            
            {/* Realism: The Steam Effect Overlay */}
            {isHotFood && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="steam-particle" style={{ animationDelay: '0s', left: '45%' }}></div>
                <div className="steam-particle" style={{ animationDelay: '1s', left: '55%' }}></div>
                <div className="steam-particle" style={{ animationDelay: '2s', left: '50%' }}></div>
              </div>
            )}

            <model-viewer
              src={product.modelUrl}
              poster={product.imageUrl}
              alt={product.name}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              auto-rotate
              shadow-intensity="2"         // Deep shadows for realism
              shadow-softness="0.5"        // Realistic soft edges
              exposure="1.3"               // Brightness for details
              environment-image="neutral"  // Reflections
              tone-mapping="commerce"      // Professional food colors
              interaction-prompt="auto"
              style={{ width: '100%', height: '100%', outline: 'none' }}
            >
              {/* Custom AR Button for Mobile */}
              <button slot="ar-button" className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2">
                <Smartphone size={20} />
                View in Your Room
              </button>

              {/* Poster/Loader */}
              <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-slate-900">
                 <img src={product.imageUrl} className="opacity-30 blur-md w-full h-full object-cover" />
                 <div className="absolute flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Preparing 3D View</p>
                 </div>
              </div>
            </model-viewer>
          </div>

          {/* Instructions Footer */}
          <div className="grid grid-cols-3 divide-x divide-slate-700 bg-slate-800 text-[10px] md:text-xs text-slate-400 py-4 uppercase tracking-tighter text-center">
            <div>Hold to Rotate</div>
            <div>Pinch to Zoom</div>
            <div>AR for Real Size</div>
          </div>
        </div>
      </div>
    </>
  );
}