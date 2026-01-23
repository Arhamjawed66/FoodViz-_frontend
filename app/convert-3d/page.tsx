'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { convertTo3D } from '@/services/api';
import { Box, ArrowLeft, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// --- Inner Component (Jahan useSearchParams use ho raha hai) ---
function Convert3DContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const imageUrl = searchParams.get('imageUrl');
  const productId = searchParams.get('productId');

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartConversion = async () => {
    if (!productId || !imageUrl) return;

    try {
      setStatus('processing');
      await convertTo3D(productId, imageUrl);
      setStatus('success');
      
      // 3 seconds baad wapis products par bhej dain
      setTimeout(() => {
        router.push('/products');
      }, 3000);
    } catch (error: any) {
      console.error('Conversion Error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to connect to AI server');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full">
            {/* Header */}
            <div className="mb-8 text-center">
              <Link href="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> BACK TO INVENTORY
              </Link>
              <h1 className="text-4xl font-black text-slate-900 flex items-center justify-center gap-3">
                AI 3D Generator <Sparkles className="text-blue-600 w-8 h-8" />
              </h1>
            </div>

            {/* Main Conversion Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 lg:p-12 text-center">
              {status === 'idle' && (
                <div className="space-y-6">
                  <div className="relative inline-block">
                    <img 
                      src={imageUrl || ''} 
                      alt="To Convert" 
                      className="w-64 h-64 object-cover rounded-[2rem] shadow-xl border-4 border-white mx-auto"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                      <Box className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Ready to transform?</h2>
                    <p className="text-slate-500 mt-2">Our AI will process this 2D image and generate a high-quality 3D digital twin (.glb) for AR viewing.</p>
                  </div>

                  <button 
                    onClick={handleStartConversion}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    START AI GENERATION
                  </button>
                </div>
              )}

              {status === 'processing' && (
                <div className="py-10 space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Loader2 className="w-24 h-24 text-blue-600 animate-spin" />
                      <Box className="w-8 h-8 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Processing Model...</h2>
                    <p className="text-slate-500 mt-2">Uploading to AI Cloud and generating geometry. This may take a few moments.</p>
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="py-10 space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Successfully Queued!</h2>
                    <p className="text-slate-500 mt-2">Conversion has started in the background. You will be redirected to the products page.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="py-10 space-y-6">
                  <div className="flex justify-center">
                    <AlertCircle className="w-24 h-24 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
                    <p className="text-red-500 mt-2 font-medium">{errorMessage}</p>
                  </div>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Info Footer */}
            <p className="text-center text-slate-400 text-xs mt-8 uppercase font-bold tracking-widest">
              Powered by FoodViz AI Engine • Railway Cloud
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Main Page Component (Wrapped in Suspense for Vercel) ---
export default function Convert3DPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Initializing AI Converter...</p>
        </div>
      </div>
    }>
      <Convert3DContent />
    </Suspense>
  );
}