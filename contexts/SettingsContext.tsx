// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '@/constants/config';
import { loadSettings, saveSettings } from '@/services/settingsService';

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (updated: Partial<AppSettings>) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const updateSettings = async (updated: Partial<AppSettings>) => {
    const next = { ...settings, ...updated };
    setSettings(next);
    await saveSettings(next);
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
