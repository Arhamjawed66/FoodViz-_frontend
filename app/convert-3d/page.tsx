'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Upload, Box, Loader2, ArrowLeft } from 'lucide-react';
import { convertTo3D } from '@/services/api';

export default function ConvertTo3DPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedModel, setConvertedModel] = useState<string | null>(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConvert = async () => {
    if (!imageUrl || !productId) return;

    setIsConverting(true);
    try {
      await convertTo3D(productId, imageUrl);
      setConvertedModel('conversion-started');
    } catch (error) {
      console.error('Conversion failed', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertFromFile = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    // TODO: Implement file-based 3D conversion
    setTimeout(() => {
      setConvertedModel('converted-model.glb');
      setIsConverting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Box className="w-10 h-10 text-blue-600" />
            Convert to 3D
          </h1>
          <p className="text-lg text-gray-600">
            Transform your 2D images into stunning 3D models using AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {imageUrl && productId ? (
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Product Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Product Image</p>
                      <p className="text-sm text-gray-500">Ready for 3D conversion</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Box className="w-4 h-4" />
                        Convert to 3D
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Upload an image to convert to 3D
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </label>
              </div>
            </div>
          )}

          {selectedFile && !imageUrl && (
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleConvertFromFile}
                    disabled={isConverting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Box className="w-4 h-4" />
                        Convert to 3D
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {convertedModel && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Box className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  {convertedModel === 'conversion-started' ? 'Conversion Started!' : 'Conversion Complete!'}
                </h3>
              </div>
              <p className="text-green-700 mb-4">
                {convertedModel === 'conversion-started'
                  ? 'Your 3D model conversion has been initiated. Check the product status for updates.'
                  : 'Your 3D model has been generated successfully.'
                }
              </p>
              {convertedModel !== 'conversion-started' && (
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Download 3D Model
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
