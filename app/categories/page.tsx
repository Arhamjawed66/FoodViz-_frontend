'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getCategories, createCategory } from '@/services/api';
import { FolderPlus, PieChart, Tag, Loader2 } from 'lucide-react';

interface Category {
  name: string;
  count: number;
  color?: string; // Optional because backend might not send it
}

export default function CategoriesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  // Fallback colors for professional look
  const colorPalette = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500', 'bg-rose-500'];

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories. Is Railway Backend online?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
      await fetchCategories(); // Refresh list
    } catch (err) {
      setError('Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const totalProducts = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 overflow-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Food Categories</h1>
            <p className="text-slate-500">Manage and organize your menu items</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-3">
             <PieChart className="text-blue-500 w-5 h-5" />
             <span className="font-semibold text-slate-700">{categories.length} Total Categories</span>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Category List Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <div key={category.name} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex items-center gap-4">
                  <div className={`w-12 h-12 ${category.color || colorPalette[index % colorPalette.length]} rounded-lg flex items-center justify-center text-white`}>
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-lg">{category.name}</h2>
                    <p className="text-slate-500 text-sm font-medium">{category.count} Products Linked</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Management Panel */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FolderPlus className="text-blue-600 w-5 h-5" /> New Category
                </h2>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Category Name (e.g. Italian)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <textarea
                    placeholder="Brief description..."
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  />
                  <button
                    disabled={addingCategory}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex justify-center"
                  >
                    {addingCategory ? <Loader2 className="animate-spin" /> : 'Create Category'}
                  </button>
                </form>
              </div>

              {/* Stats Box */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                 <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-4">Quick Insights</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-300">Active Menu</span>
                      <span className="font-mono text-blue-400">{totalProducts} Items</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-300">Density</span>
                      <span className="font-mono text-purple-400">Avg {categories.length > 0 ? (totalProducts / categories.length).toFixed(1) : 0} p/c</span>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}