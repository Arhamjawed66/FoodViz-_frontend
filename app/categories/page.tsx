'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getCategories, createCategory } from '@/services/api';

interface Category {
  name: string;
  count: number;
  color: string;
}

export default function CategoriesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const totalProducts = categories.reduce((sum, category) => sum + category.count, 0);
  const averagePerCategory = categories.length > 0 ? (totalProducts / categories.length).toFixed(2) : '0';

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAddingCategory(true);
    try {
      await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      // Refresh categories
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading categories...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Categories</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-xl">{category.name.charAt(0)}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                <p className="text-gray-600">{category.count} products</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Category Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Add New Category</h3>
                <form onSubmit={handleAddCategory}>
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    placeholder="Category description (optional)"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={addingCategory}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingCategory ? 'Adding...' : 'Add Category'}
                  </button>
                </form>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Categories:</span>
                    <span className="font-semibold">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-semibold">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average per Category:</span>
                    <span className="font-semibold">{averagePerCategory}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
