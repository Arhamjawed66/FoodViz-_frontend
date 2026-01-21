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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('barcode', formData.barcode);
    if (image) data.append('image', image);

    try {
      await createProduct(data);
      alert('Product added successfully! Generating 3D Model...');
      router.push('/');
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Select Category</option>
            <option value="Dasi Food">Dasi Food</option>
            <option value="Chinese Food">Chinese Food</option>
            <option value="Fast Food">Fast Food</option>
            <option value="Junk Food">Junk Food</option>
          </select>
          <input
            type="text"
            name="barcode"
            placeholder="Barcode"
            value={formData.barcode}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <div className="border-2 border-dashed border-gray-300 p-4 rounded cursor-pointer hover:border-gray-400">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
              ) : (
                <div className="text-center">
                  <p className="text-gray-500">Click to upload image</p>
                </div>
              )}
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Generating 3D Model...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
