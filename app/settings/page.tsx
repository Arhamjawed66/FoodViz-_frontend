'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  Settings, 
  Bell, 
  Moon, 
  Save, 
  Globe, 
  DollarSign, 
  User, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { settings, updateSetting } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('All configurations updated successfully!');
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <Settings className="text-blue-600 w-8 h-8" /> System Configurations
              </h1>
              <p className="text-slate-500 mt-2">Manage your global preferences and account security</p>
            </div>
            <button 
              onClick={handleSaveAll}
              className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="max-w-5xl space-y-8">
            {/* General Preferences Section */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Zap className="w-5 h-5" /></div>
                <h2 className="text-xl font-bold text-slate-800">Experience & Automation</h2>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Notification Toggle */}
                <div className="flex items-center justify-between group">
                  <div className="flex gap-4">
                    <div className="mt-1"><Bell className="text-slate-400 group-hover:text-blue-500 transition-colors" /></div>
                    <div>
                      <h3 className="font-bold text-slate-800">Live Notifications</h3>
                      <p className="text-slate-500 text-sm">Real-time alerts for 3D model generation status</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer scale-110">
                    <input type="checkbox" checked={settings.notifications} onChange={(e) => updateSetting('notifications', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between group pt-4 border-t border-slate-50">
                  <div className="flex gap-4">
                    <div className="mt-1"><Moon className="text-slate-400 group-hover:text-indigo-500 transition-colors" /></div>
                    <div>
                      <h3 className="font-bold text-slate-800">Interface Mode</h3>
                      <p className="text-slate-500 text-sm">Switch between light and dark visual themes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer scale-110">
                    <input type="checkbox" checked={settings.darkMode} onChange={(e) => updateSetting('darkMode', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Localization Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="text-blue-500 w-5 h-5" />
                  <h2 className="font-bold text-slate-800">Regional Language</h2>
                </div>
                <select 
                  value={settings.language} 
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 appearance-none"
                >
                  <option value="en">English (United States)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                </select>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="text-emerald-500 w-5 h-5" />
                  <h2 className="font-bold text-slate-800">Display Currency</h2>
                </div>
                <select 
                  value={settings.currency} 
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
                >
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="PKR">PKR - Pak Rupee (Rs)</option>
                </select>
              </div>
            </div>

            {/* Account Security Section */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><ShieldCheck className="w-5 h-5" /></div>
                <h2 className="text-xl font-bold text-slate-800">Account & Security</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Email Address</label>
                  <input type="email" defaultValue="admin@foodviz.com" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Update Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="px-8 pb-8">
                 <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Setup Two-Factor Authentication (2FA) →</button>
              </div>
            </section>

            {/* Mobile Save Button */}
            <div className="md:hidden">
              <button 
                onClick={handleSaveAll}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold"
              >
                Save All Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}