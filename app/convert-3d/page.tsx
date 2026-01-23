'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Upload, Box, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
// @ts-ignore
import { convertTo3D } from '@/services/api';

export default function ConvertTo3DPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedModelUrl, setConvertedModelUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    const url = searchParams.get('imageUrl');
    const id = searchParams.get('productId');
    if (url && id) {
      setImageUrl(url);
      setProductId(id);
    }
  }, [searchParams]);

  // --- LOGIC: File se 3D banana ---
  const handleConvertFromFile = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    try {
      // 1. Pehle image ko backend par upload karein (Temporary)
      const formData = new FormData();
      formData.append('model', selectedFile); // Hum wahi endpoint use kar rahe hain jo humne server.js mein banaya

      const response = await fetch('https://foodviz-backend-production.up.railway.app/api/upload-to-cloud', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Mocking conversion delay - asal mein yahan AI API call hogi
        setTimeout(() => {
          setConvertedModelUrl(data.url); // Yahan Cloudinary ka link mil jayega
          setIsConverting(false);
        }, 3000);
      }
    } catch (error) {
      console.error('File conversion failed', error);
      setIsConverting(false);
    }
  };

  // --- LOGIC: Existing image se 3D banana ---
  const handleConvert = async () => {
    if (!imageUrl || !productId) return;
    setIsConverting(true);
    try {
      await convertTo3D(productId, imageUrl);
      setConvertedModelUrl('started');
    } catch (error) {
      console.error('Conversion failed', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-all">
        <ArrowLeft className="w-5 h-5" /> Back to Products
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white text-center">
          <Box className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold">AI 3D Generator</h1>
          <p className="text-blue-100 mt-2">Convert your food images into high-quality .GLB models</p>
        </div>

        <div className="p-10">
          {!convertedModelUrl ? (
            <div className="space-y-8">
              {/* Image Preview / Upload Section */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                {imageUrl || selectedFile ? (
                  <div className="relative inline-block">
                    <img 
                      src={imageUrl || (selectedFile ? URL.createObjectURL(selectedFile) : '')} 
                      className="w-48 h-48 object-cover rounded-2xl shadow-lg border-4 border-white" 
                      alt="Preview" 
                    />
                    <div className="absolute -bottom-3 -right-3 bg-blue-600 p-2 rounded-full text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Drag and drop food image here</p>
                    <input type="file" className="hidden" id="file-up" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    <label htmlFor="file-up" className="mt-4 inline-block text-blue-600 font-bold cursor-pointer hover:underline text-sm">Or browse files</label>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={imageUrl ? handleConvert : handleConvertFromFile}
                disabled={isConverting || (!imageUrl && !selectedFile)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
              >
                {isConverting ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> AI is Processing...</>
                ) : (
                  <><Box className="w-6 h-6" /> Generate 3D Model</>
                )}
              </button>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Conversion Successful!</h2>
              <p className="text-slate-500 mt-2 mb-8">Your 3D asset is now live on Railway and Cloudinary.</p>
              
              <div className="flex gap-4">
                <button onClick={() => router.push('/products')} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200">View Products</button>
                <a href={convertedModelUrl} download className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 text-center">Download .GLB</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}