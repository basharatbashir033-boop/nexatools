import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from '../data/translations';

interface AppContextType { lang: Lang; toggleLang: () => void; dark: boolean; toggleDark: () => void; t: (key: TranslationKey) => string; dir: 'ltr' | 'rtl'; }

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [dark, setDark] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggleLang = useCallback(() => setLang(l => l === 'en' ? 'ur' : 'en'), []);
  const toggleDark = useCallback(() => setDark(d => !d), []);
  const dir = lang === 'ur' ? 'rtl' : 'ltr';
  const t = useCallback((key: TranslationKey) => translations[lang][key] || translations.en[key] || key, [lang]);

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { document.documentElement.dir = dir; document.documentElement.lang = lang; }, [lang, dir]);

  return <AppContext.Provider value={{ lang, toggleLang, dark, toggleDark, t, dir }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
