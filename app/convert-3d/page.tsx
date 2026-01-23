'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

function ConvertContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('imageUrl');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-10 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-black mb-6">AI 3D Conversion</h1>
          {imageUrl && <img src={imageUrl} className="w-64 h-64 rounded-2xl shadow-xl mb-6" alt="Preview" />}
          <p className="text-slate-500 font-bold animate-pulse text-lg">AI Engine Ready...</p>
          <button className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">
            GENERATE 3D MODEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Convert3DPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold">Loading AI Engine...</div>}>
      <ConvertContent />
    </Suspense>
  );
}