'use client';

import { useState } from 'react';
import { createProduct } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Upload, Package, Image as ImageIcon, File, Sparkles } from 'lucide-react';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    barcode: '',
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null); // New state for 3D Model
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 3D Model handle karne ke liye naya function
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setModelFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalModelUrl = '';

      // 1. Pehle agar 3D Model file hai, toh use Cloudinary par bhejein
      if (modelFile) {
        const modelData = new FormData();
        modelData.append('model', modelFile);

        const uploadRes = await fetch('https://foodviz-backend-production.up.railway.app/api/upload-to-cloud', {
          method: 'POST',
          body: modelData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success) {
          finalModelUrl = uploadJson.url;
        }
      }

      // 2. Ab sara data backend par bhejein
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('barcode', formData.barcode);
      data.append('modelUrl', finalModelUrl); // Cloudinary link save karein
      data.append('modelStatus', finalModelUrl ? 'completed' : 'pending');
      
      if (image) data.append('image', image);

      await createProduct(data);
      alert('Product Added Successfully with Cloudinary 3D Model! 🚀');
      router.push('/');
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-cool-bg flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="card-gradient p-10 rounded-3xl shadow-large w-full max-w-2xl hover-lift transition-all duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary-bg rounded-full mb-4 shadow-glow">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black pro-heading-gradient mb-2">Add New Product</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Create stunning 3D food experiences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-gradient w-full p-4 rounded-2xl focus-ring-gradient text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Price</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="input-gradient w-full p-4 rounded-2xl focus-ring-gradient text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              placeholder="Describe your delicious product..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input-gradient w-full p-4 rounded-2xl focus-ring-gradient text-slate-800 dark:text-slate-200 font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="input-gradient w-full p-4 rounded-2xl focus-ring-gradient text-slate-800 dark:text-slate-200 font-medium appearance-none"
              >
                <option value="">Select Category</option>
                <option value="Desi Food">🇵🇰 Desi Food</option>
                <option value="Chinese Food">🇨🇳 Chinese Food</option>
                <option value="Fast Food">🍔 Fast Food</option>
                <option value="Junk Food">🍟 Junk Food</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Barcode</label>
              <input
                type="text"
                name="barcode"
                placeholder="Scan or enter barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                className="input-gradient w-full p-4 rounded-2xl focus-ring-gradient text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
          </div>

          {/* File Upload Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Product Image
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 p-6 rounded-2xl text-center hover:border-blue-400 transition-colors duration-300 bg-slate-50 dark:bg-slate-800/50">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl mx-auto shadow-lg" />
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold">Image Selected ✓</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                      <p className="text-slate-500 dark:text-slate-400 font-medium">Click to upload image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* 3D Model Upload */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                <File className="w-4 h-4 mr-2" />
                3D Model (.glb)
              </label>
              <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 p-6 rounded-2xl text-center hover:border-blue-500 transition-colors duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <input type="file" accept=".glb" onChange={handleModelChange} className="hidden" id="model-upload" />
                <label htmlFor="model-upload" className="cursor-pointer block">
                  {modelFile ? (
                    <div className="space-y-3">
                      <Sparkles className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
                      <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">{modelFile.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">3D Model Ready ✓</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <File className="w-12 h-12 text-blue-400 mx-auto" />
                      <p className="text-blue-500 dark:text-blue-400 font-medium">Click to upload 3D model</p>
                      <p className="text-slate-400 text-xs">(.glb format only)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl ${
              loading
                ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                : 'btn-gradient-primary hover-lift'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Uploading to Cloud...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="w-6 h-6 mr-3" />
                Create Product
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}