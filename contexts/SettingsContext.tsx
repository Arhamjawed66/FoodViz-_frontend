'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoSave: boolean;
  language: string;
  currency: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: any) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  notifications: true,
  darkMode: false,
  autoSave: true,
  language: 'en',
  currency: 'USD',
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('appSettings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
