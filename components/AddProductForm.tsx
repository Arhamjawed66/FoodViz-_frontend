'use client';

import { useState } from 'react';
import { createProduct } from '@/services/api';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Text Inputs */}
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
          
          {/* Category Dropdown */}
          <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
            <option value="">Select Category</option>
            <option value="Dasi Food">Dasi Food</option>
            <option value="Chinese Food">Chinese Food</option>
            <option value="Fast Food">Fast Food</option>
            <option value="Junk Food">Junk Food</option>
          </select>

          {/* Image Upload Box */}
          <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer block">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain mx-auto" />
              ) : (
                <p className="text-gray-500">📷 Click to upload Image</p>
              )}
            </label>
          </div>

          {/* 3D Model (.glb) Upload Box */}
          <div className="border-2 border-dashed border-blue-200 p-4 rounded text-center bg-blue-50">
            <input type="file" accept=".glb" onChange={handleModelChange} className="hidden" id="model-upload" />
            <label htmlFor="model-upload" className="cursor-pointer block">
              {modelFile ? (
                <p className="text-blue-600 font-semibold">📦 {modelFile.name} selected</p>
              ) : (
                <p className="text-blue-500">🧱 Click to upload 3D Model (.glb)</p>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Uploading to Cloud...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}