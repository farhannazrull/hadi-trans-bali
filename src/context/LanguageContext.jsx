'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Start with the default so server and client markup match, then apply the saved choice.
  const [language, setLanguageState] = useState('id');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === 'id' || saved === 'en') setLanguageState(saved);
    } catch { /* storage unavailable */ }
  }, []);

  const setLanguage = (next) => {
    setLanguageState(next);
    try { localStorage.setItem('language', next); } catch { /* ignore */ }
  };

  const toggleLanguage = () => setLanguage(language === 'id' ? 'en' : 'id');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Inline text for strings that are not worth a translations.js key: tr('Indonesia', 'English')
  const tr = (id, en) => (language === 'id' ? id : en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
